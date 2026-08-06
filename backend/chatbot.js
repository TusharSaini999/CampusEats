const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');
require('dotenv').config();

// Round-Robin API Key Setup
const apiKeyString = process.env.GEMINI_API_KEYS || "";
let keys = apiKeyString.split(",").map(k => k.trim()).filter(Boolean);

if (keys.length === 0) {
  let i = 1;
  while (process.env[`GEMINI_API_KEY_${i}`]) {
    keys.push(process.env[`GEMINI_API_KEY_${i}`].trim());
    i++;
  }
}
if (process.env.GEMINI_API_KEY && keys.length === 0) {
  keys.push(process.env.GEMINI_API_KEY.trim());
}

if (keys.length === 0) {
  console.warn("No Gemini API keys found. Please set GEMINI_API_KEYS, GEMINI_API_KEY_1, or GEMINI_API_KEY in your .env file");
}

let currentKeyIndex = 0;
function getNextApiKey() {
  if (keys.length === 0) return null;
  const key = keys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return key;
}

// Tool Definitions for Gemini
const tools = [{
  functionDeclarations: [
    {
      name: "search_menu",
      description: "Search the CampusEats menu for food items based on a query.",
      parameters: {
        type: "OBJECT",
        properties: {
          query: {
            type: "STRING",
            description: "The name or category of the food to search for (e.g., 'pizza', 'burger')",
          }
        },
        required: ["query"],
      },
    },
    {
      name: "get_order_history",
      description: "Get the past order history for the currently logged-in customer.",
      parameters: {
        type: "OBJECT",
        properties: {}
      },
    },
    {
      name: "get_vendor_orders",
      description: "Get the pending and past orders for the currently logged-in vendor.",
      parameters: {
        type: "OBJECT",
        properties: {}
      },
    },
    {
      name: "get_profile_details",
      description: "Get the profile details (name, phone, address) of the currently logged-in user.",
      parameters: {
        type: "OBJECT",
        properties: {}
      },
    },
    {
      name: "add_to_cart",
      description: "Add a specific menu item to the user's cart. You must search the menu first to get the menu_id.",
      parameters: {
        type: "OBJECT",
        properties: {
          menu_id: { type: "INTEGER", description: "The exact ID of the menu item" },
          quantity: { type: "INTEGER", description: "The quantity to order" }
        },
        required: ["menu_id", "quantity"],
      },
    }
  ]
}];

// Tool Executors
async function executeTool(toolCall, userId, userType) {
  const functionName = toolCall.name;
  const functionArgs = toolCall.args;

  try {
    if (functionName === "search_menu") {
      const [results] = await db.promise().query(
        `SELECT m.name, m.description, m.price, m.category, v.name as vendor_name FROM menu m JOIN vendors v ON m.vendor_id = v.id WHERE (m.name LIKE ? OR m.category LIKE ?) AND m.delete != 1 LIMIT 10`,
        [`%${functionArgs.query}%`, `%${functionArgs.query}%`]
      );
      return { response: results.length > 0 ? results : { message: "No menu items found." } };
    }
    
    if (functionName === "get_order_history") {
      if (userType !== 'user') return { error: "Access Denied: Only logged-in customers have an order history. Please explain this to the user." };
      const [results] = await db.promise().query(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`, [userId]);
      return { response: results.length > 0 ? results : { message: "No past orders found." } };
    }

    if (functionName === "get_vendor_orders") {
      if (userType !== 'vendor') return { error: "Access Denied: Only logged-in vendors can view vendor orders. Please explain this to the user." };
      const query = `
        SELECT oi.quantity, m.name as item_name, (oi.price * oi.quantity) as total_price, o.created_at as order_date 
        FROM order_items oi 
        JOIN menu m ON oi.menu_id = m.id 
        JOIN orders o ON oi.o_id = o.id 
        WHERE m.vendor_id = ? ORDER BY o.created_at DESC LIMIT 5`;
      const [results] = await db.promise().query(query, [userId]);
      return { response: results.length > 0 ? results : { message: "No orders found." } };
    }

    if (functionName === "get_profile_details") {
      if (!userType || userType === "guest") return { error: "Access Denied: Guests do not have a profile. Please tell the user to log in." };
      let table = "users";
      if (userType === "vendor") table = "vendors";
      if (userType === "delivery_boy") table = "delivery";
      
      const [results] = await db.promise().query(`SELECT * FROM ${table} WHERE id = ?`, [userId]);
      return { response: results.length > 0 ? results[0] : { error: "User not found." } };
    }

    if (functionName === "add_to_cart") {
      if (userType !== 'user') return { error: "Access Denied: Only logged-in customers can add items to their cart. Tell the user to log in." };
      
      const { menu_id, quantity } = functionArgs;
      if (!menu_id || !quantity) return { error: "Missing menu_id or quantity." };

      const [menuItem] = await db.promise().query("SELECT name, price FROM menu WHERE id = ?", [menu_id]);
      if (menuItem.length === 0) return { error: "Menu item not found." };

      const { name, price } = menuItem[0];
      const total_price = price * quantity;
      const order_id = Date.now();

      const [existingItem] = await db.promise().query(
        "SELECT * FROM order_items WHERE menu_id = ? AND user_id = ? AND o_id IS NULL",
        [menu_id, userId]
      );

      if (existingItem.length > 0) {
         return { error: "Item already in cart. The user must update the quantity manually in the Cart UI." };
      }

      const query = `
        INSERT INTO order_items (order_id, menu_id, quantity, price, item_name, user_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await db.promise().query(query, [order_id, menu_id, quantity, total_price, name, userId]);

      return { message: `Successfully added ${quantity}x ${name} to cart for ₹${total_price}. Remind the user they can checkout by visiting the Cart page.` };
    }

    return { error: `Unknown function: ${functionName}` };
  } catch (err) {
    console.error(`Error executing ${functionName}:`, err);
    return { error: `Failed to execute ${functionName}: ${err.message}` };
  }
}

router.post('/', async (req, res) => {
  const { messages, userId, userType } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Valid 'messages' array is required." });
  }

  const apiKey = getNextApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: "No Gemini API keys configured on the server." });
  }

  const ai = new GoogleGenAI({ apiKey });

  // System prompt injection
  const systemInstruction = `You are Eatsy, the CampusEats AI Assistant. You help users, vendors, and delivery staff navigate the CampusEats platform.
You are a ReAct (Reasoning and Acting) agent. For every user request, you should first THINK about what tools you need to call.
The current user is logged in as: ${userType || 'guest'} (User ID: ${userId || 'none'}).

### Rules for Different Users:
- **Guests**: Can ONLY search the menu. They cannot check order history or view profile details. If a guest asks for these, politely ask them to log in.
- **Users**: Can search the menu, view their own order history, and view their profile.
- **Vendors**: Can search the menu, view vendor orders, and view their profile.

### Guidelines:
1. If the user asks for data that requires a database lookup, ALWAYS use the provided tools.
2. NEVER invent or hallucinate menu items or orders.
3. If a tool returns an error, read the error and explain it to the user politely.
4. Format your final answers beautifully using Markdown (bolding, lists, etc.) so it looks great in the chat UI.
5. All monetary values and prices across the CampusEats system are in Indian Rupees (INR). Always format prices using the ₹ symbol or "Rs." (e.g., ₹120 or Rs. 120), NEVER use dollars ($).
6. If the user wants to order food, search the menu first to find the exact menu_id, then use the add_to_cart tool to place it in their cart.`;

  // Map incoming OpenAI-style messages to Gemini Content array
  const contents = messages.map(msg => {
    return {
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content || "" }]
    };
  });

  try {
    let maxIterations = 5;
    let finalResponseText = null;
    let currentContents = [...contents]; // Working array for the session

    while (maxIterations-- > 0) {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
        contents: currentContents,
        config: {
          systemInstruction: systemInstruction,
          tools: tools
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        // AI decided to call tools
        
        // Push the AI's full response content (including function calls and thought signatures) into the context
        if (response.candidates && response.candidates[0].content) {
          currentContents.push(response.candidates[0].content);
        } else {
          // Fallback just in case
          currentContents.push({
            role: 'model',
            parts: response.functionCalls.map(fc => ({ functionCall: fc }))
          });
        }

        // Execute all tools and collect their responses
        const toolResponses = [];
        for (const call of response.functionCalls) {
          const result = await executeTool(call, userId, userType);
          toolResponses.push({
            functionResponse: {
              name: call.name,
              response: result
            }
          });
        }

        // Push the tool responses back into the context
        currentContents.push({
          role: 'user',
          parts: toolResponses
        });
        
        // Loop continues to get the model's next turn (which could be the final text answer)
      } else {
        // No more function calls, we have the final text answer
        finalResponseText = response.text;
        break;
      }
    }

    if (!finalResponseText) {
      finalResponseText = "I'm sorry, I'm taking too long to process this request. Please try again.";
    }

    // Return in the format expected by the frontend
    res.status(200).json({ message: { role: "assistant", content: finalResponseText } });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(200).json({ message: { role: "assistant", content: "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment." } });
  }
});

module.exports = router;
