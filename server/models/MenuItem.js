const mongoose = require('mongoose');

// This defines the structure of a single menu item
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., Starter, Main, Drink
    description: { type: String },
    imageUrl: { type: String }, // Link to an image of the food
    isAvailable: { type: Boolean, default: true }
});

// We turn that schema into a "Model" we can use to save data
module.exports = mongoose.model('MenuItem', menuItemSchema);