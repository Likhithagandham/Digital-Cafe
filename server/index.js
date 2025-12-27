const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

const app = express();
const PORT = process.env.PORT || 5000; // Updated for Deployment

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ Database Connection Error:", err));

// --- MENU SCHEMA & ROUTES ---
// (Your existing menu routes are perfect - keeping them as is)

app.post('/add-menu', async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/get-menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/edit-menu/:id', async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedItem);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/delete-menu/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- ORDER SCHEMA & KITCHEN ROUTES ---

const orderSchema = new mongoose.Schema({
  items: [{
      name: String,
      price: Number,
      qty: Number
  }],
  total: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

app.post("/place-order", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (error) { res.status(500).send(error); }
});

app.get("/get-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).send(orders);
  } catch (error) { res.status(500).send(error); }
});

// --- ANALYTICS ROUTE (NEW) ---
app.get("/get-stats", async (req, res) => {
    try {
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        
        // Logical aggregation for item popularity
        const itemSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
            });
        });

        res.status(200).json({ totalRevenue, totalOrders, itemSales });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/complete-order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Order served and cleared!" });
  } catch (error) { res.status(500).send(error); }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});