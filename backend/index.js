const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const app = express();
const path = require("path");
require('dotenv').config();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(bodyParser.json());

// Import route files
const usersRoute = require("./customer");
const vendorsRoute = require("./vendor");
const menuRoute = require("./menu");
const ordersRoute = require("./order");
const orderItemsRoute = require("./order_items");
const categoriesRoute = require("./categories");
const deliverRoute = require("./deliver");
const getmap = require("./getlocationmap");
const chatbotRoute = require("./chatbot");

// Use routes
app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/profile", express.static(path.join(__dirname, "./profile")));
app.use("/users", usersRoute);
app.use("/vendors", vendorsRoute);
app.use("/menu", menuRoute);
app.use("/orders", ordersRoute);
app.use("/order_items", orderItemsRoute);
app.use("/categories", categoriesRoute);
app.use("/delivery", deliverRoute);
app.use("/map", getmap);
app.use("/api/chat", chatbotRoute);

// Start the server (for local development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
