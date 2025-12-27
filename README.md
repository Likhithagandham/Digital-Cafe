# ☕ Digital Cafe - Full-Stack MERN Platform

A complete Cafe Management System built with the MERN stack. This project demonstrates a real-world application of a dual-interface platform where customers can place orders and administrators can manage operations in real-time.

**🔗 Live Demo:** [https://digital-cafe-mu.vercel.app/](https://digital-cafe-mu.vercel.app/)

---

## 🌟 Key Features

### 🛒 Customer Experience
* **Dynamic Menu:** Browsable food items categorized for easy navigation.
* **Instant Search:** Real-time filtering of dishes as the user types.
* **Smart Cart:** A floating shopping cart that calculates totals and manages quantities.
* **Order Placement:** Seamlessly send orders directly to the kitchen display.

### 👨‍🍳 Admin & Kitchen Management
* **Secure Admin Access:** Protected dashboard via a secret key.
* **CRUD Operations:** Fully functional interface to **C**reate, **R**ead, **U**pdate, and **D**elete menu items.
* **Kitchen Display System (KDS):** A live "Ticket" view for chefs to track incoming orders and mark them as served.

---

## 🛠️ Technical Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React.js (Vite), Axios, CSS3 (Custom Modules) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Deployment** | Vercel (Client), Render (Server) |

---

## 📂 Project Structure

This project is organized as a **Monorepo** for clean version control:

```text
├── client/          # React Frontend (Vite)
├── server/          # Node.js/Express Backend & Models
├── .gitignore       # Root level git ignore (Protects .env)
└── README.md        # Documentation
```

## 📸 Screenshots

<img width="1895" height="876" alt="image" src="https://github.com/user-attachments/assets/cffd9ba9-9640-4d36-b2a9-61bdf00e8ea4" />
<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/db447203-a215-4ead-9371-494cd722d21d" />
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/2a1ad0e2-4a95-4f15-beb1-958b8b205b83" />
<img width="1895" height="821" alt="image" src="https://github.com/user-attachments/assets/035ff516-03ab-4582-a432-d44eab5756ca" />



🚀 Installation & Local Setup
To run this project on your local machine:

Clone the repository:

Bash

git clone [https://github.com/Likhithagandham/Digital-Cafe.git](https://github.com/Likhithagandham/Digital-Cafe.git)
cd Digital-Cafe
Configure Backend:

Navigate to /server.

Install dependencies: npm install.

Create a .env file and add: MONGO_URI=your_mongodb_connection_string.

Start server: node index.js.

Configure Frontend:

Navigate to /client.

Install dependencies: npm install.

Start development server: npm run dev.

📝 Future Enhancements
[ ] Real-time notifications using Socket.io.

[ ] User authentication (JWT) for individual customer accounts.

[ ] Revenue analytics dashboard with charts.

Developed with ❤️ by Likhitha Gandham
