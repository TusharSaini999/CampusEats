const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const db = require('./db');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "missing_api_key",
});

// Tool Definitions
const tools = [
  {
    type: "function",
    function: {
      name: "search_menu",
      description: "Search the CampusEats menu for food items based on a query.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The name or category of the food to search for (e.g., 'pizza', 'burger')",
          }
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_history",
      description: "Get the past order history for the currently logged-in customer.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_vendor_orders",
      description: "Get the pending and past orders for the currently logged-in vendor.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_profile_details",
      description: "Get the profile details (name, phone, address) of the currently logged-in user.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add a specific menu item to the user's cart. You must search the menu first to get the menu_id.",
      parameters: {
        type: "object",
        properties: {
          menu_id: { type: "integer", description: "The exact ID of the menu item" },
          quantity: { type: "integer", description: "The quantity to order" }
        },
        required: ["menu_id", "quantity"],
      },
    },
  }
];

// Tool Executors
async function executeTool(toolCall, userId, userType) {
  const functionName = toolCall.function.name;
  const functionArgs = JSON.parse(toolCall.function.arguments);

  try {
    if (functionName === "search_menu") {
      const [results] = await db.promise().query(
        `SELECT m.name, m.description, m.price, m.category, v.name as vendor_name FROM menu m JOIN vendors v ON m.vendor_id = v.id WHERE (m.name LIKE ? OR m.category LIKE ?) AND m.delete != 1 LIMIT 10`,
        [`%${functionArgs.query}%`, `%${functionArgs.query}%`]
      );
      return JSON.stringify(results.length > 0 ? results : { message: "No menu items found." });
    }
    
    if (functionName === "get_order_history") {
      if (userType !== 'user') return JSON.stringify({ error: "Access Denied: Only logged-in customers have an order history. Please explain this to the user." });
      const [results] = await db.promise().query(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`, [userId]);
      return JSON.stringify(results.length > 0 ? results : { message: "No past orders found." });
    }

    if (functionName === "get_vendor_orders") {
      if (userType !== 'vendor') return JSON.stringify({ error: "Access Denied: Only logged-in vendors can view vendor orders. Please explain this to the user." });
      const query = `
        SELECT oi.quantity, m.name as item_name, (oi.price * oi.quantity) as total_price, o.created_at as order_date 
        FROM order_items oi 
        JOIN menu m ON oi.menu_id = m.id 
        JOIN orders o ON oi.o_id = o.id 
        WHERE m.vendor_id = ? ORDER BY o.created_at DESC LIMIT 5`;
      const [results] = await db.promise().query(query, [userId]);
      return JSON.stringify(results.length > 0 ? results : { message: "No orders found." });
    }

    if (functionName === "get_profile_details") {
      if (!userType || userType === "guest") return JSON.stringify({ error: "Access Denied: Guests do not have a profile. Please tell the user to log in." });
      let table = "users";
      if (userType === "vendor") table = "vendors";
      if (userType === "delivery_boy") table = "delivery";
      
      const [results] = await db.promise().query(`SELECT * FROM ${table} WHERE id = ?`, [userId]);
      return JSON.stringify(results.length > 0 ? results[0] : { error: "User not found." });
    }

    if (functionName === "add_to_cart") {
      if (userType !== 'user') return JSON.stringify({ error: "Access Denied: Only logged-in customers can add items to their cart. Tell the user to log in." });
      
      const { menu_id, quantity } = functionArgs;
      if (!menu_id || !quantity) return JSON.stringify({ error: "Missing menu_id or quantity." });

      const [menuItem] = await db.promise().query("SELECT name, price FROM menu WHERE id = ?", [menu_id]);
      if (menuItem.length === 0) return JSON.stringify({ error: "Menu item not found." });

      const { name, price } = menuItem[0];
      const total_price = price * quantity;
      const order_id = Date.now();

      const [existingItem] = await db.promise().query(
        "SELECT * FROM order_items WHERE menu_id = ? AND user_id = ? AND o_id IS NULL",
        [menu_id, userId]
      );

      if (existingItem.length > 0) {
         return JSON.stringify({ error: "Item already in cart. The user must update the quantity manually in the Cart UI." });
      }

      const query = `
        INSERT INTO order_items (order_id, menu_id, quantity, price, item_name, user_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await db.promise().query(query, [order_id, menu_id, quantity, total_price, name, userId]);

      return JSON.stringify({ message: `Successfully added ${quantity}x ${name} to cart for ₹${total_price}. Remind the user they can checkout by visiting the Cart page.` });
    }

    return JSON.stringify({ error: `Unknown function: ${functionName}` });
  } catch (err) {
    console.error(`Error executing ${functionName}:`, err);
    return JSON.stringify({ error: `Failed to execute ${functionName}: ${err.message}` });
  }
}

router.post('/', async (req, res) => {
  const { messages, userId, userType } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Valid 'messages' array is required." });
  }

  // System prompt injection
  const systemMessage = {
    role: "system",
    content: `You are Eatsy, the CampusEats AI Assistant. You help users, vendors, and delivery staff navigate the CampusEats platform.
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
6. If the user wants to order food, search the menu first to find the exact menu_id, then use the add_to_cart tool to place it in their cart.`
  };

  const apiMessages = [systemMessage, ...messages];

  try {
    let maxIterations = 5;
    let finalResponse = null;

    while (maxIterations-- > 0) {
      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: apiMessages,
        tools: tools,
        tool_choice: "auto",
        max_tokens: 1024
      });

      const responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        apiMessages.push(responseMessage); // Add the assistant's tool call request

        for (const toolCall of responseMessage.tool_calls) {
          const functionResponse = await executeTool(toolCall, userId, userType);
          
          apiMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: toolCall.function.name,
            content: functionResponse,
          });
        }
        // Loop continues to feed tool responses back to the LLM
      } else {
        // No more tool calls, we have the final answer
        finalResponse = responseMessage;
        break;
      }
    }

    if (!finalResponse) {
      finalResponse = { role: "assistant", content: "I'm sorry, I'm taking too long to process this request. Please try again." };
    }

    res.status(200).json({ message: finalResponse });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
});

module.exports = router;
