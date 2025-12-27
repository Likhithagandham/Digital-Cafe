import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css';

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Admin & View States
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("menu"); // 'menu' or 'kitchen'
  const [secretKey, setSecretKey] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Main Course', description: '', imageUrl: ''
  });

  // --- 2. API CALLS ---
  useEffect(() => {
    fetchMenu();
  }, []);

  // Fetch orders only when Admin logs in or switches to Kitchen View
  useEffect(() => {
    if (isAdmin && view === "kitchen") {
      fetchOrders();
    }
  }, [isAdmin, view]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get-menu');
      setMenu(res.data);
    } catch (err) { console.error("Fetch Menu Error:", err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get-orders');
      setOrders(res.data);
    } catch (err) { console.error("Fetch Orders Error:", err); }
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      items: cart,
      total: cart.reduce((a, b) => a + b.price * b.qty, 0),
    };
    try {
      await axios.post('http://localhost:5000/place-order', orderData);
      showNotification("🚀 Order sent to Kitchen!");
      setCart([]);
      setIsCartOpen(false);
    } catch (err) { alert("Order failed!"); }
  };

  const markAsServed = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/complete-order/${id}`);
      showNotification("🍽️ Order Served!");
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  const handleSubmitMenu = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/edit-menu/${editingId}`, formData);
        showNotification("📝 Dish Updated!");
      } else {
        await axios.post('http://localhost:5000/add-menu', formData);
        showNotification("➕ Dish Added!");
      }
      resetForm();
      fetchMenu();
    } catch (err) { console.error(err); }
  };

  // --- 3. UI HELPERS ---
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else { setCart([...cart, { ...item, qty: 1 }]); }
    showNotification(`✅ Added ${item.name}`);
  };

  const removeFromCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing.qty === 1) {
      setCart(cart.filter(c => c._id !== item._id));
    } else {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty - 1 } : c));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'Main Course', description: '', imageUrl: '' });
    setEditingId(null);
  };

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      {notification && <div className="toast-notification">{notification}</div>}

      {/* FLOATING CART (Customer Only) */}
      {!isAdmin && (
        <div className="floating-cart-icon" onClick={() => setIsCartOpen(true)}>
          <span>🛒</span>
          {cart.length > 0 && <div className="cart-badge">{cart.reduce((a, b) => a + b.qty, 0)}</div>}
        </div>
      )}

      <header className="cafe-header">
        <h1>☕ Digital Cafe</h1>
      </header>

      {/* ADMIN CONTROLS & NAVIGATION */}
      <div className="login-section">
        {!isAdmin ? (
          <div className="login-bar">
            <input type="password" placeholder="Admin Key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            <button onClick={() => secretKey === "admin123" ? setIsAdmin(true) : alert("Wrong Key")} className="login-btn">Login</button>
          </div>
        ) : (
          <div className="admin-nav">
            <div className="admin-header">
              <span className="admin-badge">Admin Mode</span>
              <button onClick={() => setView("menu")} className={view === "menu" ? "nav-btn active" : "nav-btn"}>Manage Menu</button>
              <button onClick={() => setView("kitchen")} className={view === "kitchen" ? "nav-btn active" : "nav-btn"}>Kitchen View</button>
            </div>
            <button onClick={() => {setIsAdmin(false); setView("menu");}} className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      {/* --- VIEW SWITCHER --- */}
      {view === "menu" ? (
        <>
          <div className="search-section">
            <input type="text" placeholder="Search for food..." className="search-bar" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="filter-buttons">
            {["All", "Starters", "Main Course", "Desserts", "Beverages"].map((cat) => (
              <button key={cat} className={selectedCategory === cat ? "filter-btn active" : "filter-btn"} onClick={() => setSelectedCategory(cat)}>{cat}</button>
            ))}
          </div>

          {isAdmin && (
            <div className="admin-section">
              <h2>{editingId ? "📝 Edit Item" : "➕ Add Item"}</h2>
              <form onSubmit={handleSubmitMenu} className="admin-form">
                <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="number" placeholder="Price" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
                <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                <button type="submit" className="submit-btn">{editingId ? "Update" : "Add to Menu"}</button>
              </form>
            </div>
          )}

          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <div key={item._id} className="menu-card">
                <div className="image-container">
                  <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.name} className="menu-image" />
                  <div className="price-tag">₹{item.price}</div>
                </div>
                <div className="menu-info">
                  <h3>{item.name}</h3>
                  {!isAdmin ? (
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>Add to Order</button>
                  ) : (
                    <div className="card-actions">
                      <button onClick={() => setEditingId(item._id)} className="edit-btn">Edit</button>
                      <button onClick={async () => {await axios.delete(`http://localhost:5000/delete-menu/${item._id}`); fetchMenu();}} className="delete-btn">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* KITCHEN VIEW */
        <div className="kitchen-container">
          <div className="kitchen-header">
             <h2>👨‍🍳 Kitchen Display System</h2>
             <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
          </div>
          <div className="orders-grid">
            {orders.length === 0 ? <p className="empty-msg">No pending orders.</p> : orders.map((order, index) => (
              <div key={order._id} className="order-card">
                <div className="order-ticket-header">Order #{index + 1}</div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="kitchen-item">{item.name} <strong>x {item.qty}</strong></div>
                  ))}
                </div>
                <div className="order-ticket-footer">
                  <span>Total: ₹{order.total}</span>
                  <button className="complete-btn" onClick={() => markAsServed(order._id)}>Mark Served</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-drawer open">
            <div className="drawer-header">
              <h2>My Order</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items-container">
              {cart.map(item => (
                <div key={item._id} className="cart-item-ui">
                  <div className="item-details">
                    <strong>{item.name}</strong>
                    <span className="item-price">₹{item.price * item.qty}</span>
                  </div>
                  <div className="item-controls">
                    <button className="circle-btn" onClick={() => removeFromCart(item)}>-</button>
                    <span>{item.qty}</span>
                    <button className="circle-btn" onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="total-row"><span>Total Payable</span><span>₹{cart.reduce((a,b) => a + b.price*b.qty, 0)}</span></div>
                <button className="checkout-btn" onClick={handlePlaceOrder}>Confirm Order</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;