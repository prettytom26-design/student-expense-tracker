# 🎓 Student Expense Tracker

A full-stack MERN application for college students to track income, expenses, and monthly budgets.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS v4 + Recharts + Lucide React
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose

---

## 🚀 Setup Instructions

### 1. Clone / Open the project
```
cd c:\Users\Sree\Desktop\pat
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster.
2. Create a database user (username + password).
3. Whitelist your IP (or use `0.0.0.0/0` for all IPs).
4. Get your connection string.

Edit `backend/.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5000
```
Replace `<username>` and `<password>` with your Atlas credentials.

### 3. Start the Backend
```bash
cd backend
npm run dev
```
Server starts at **http://localhost:5000**

### 4. Start the Frontend
```bash
cd frontend
npm run dev
```
App opens at **http://localhost:3000**

---

## 📁 Project Structure
```
pat/
├── backend/
│   ├── models/Transaction.js     ← Mongoose schema
│   ├── routes/transactions.js    ← All CRUD + aggregate routes
│   ├── server.js                 ← Express app entry point
│   └── .env                      ← MongoDB URI (edit this!)
└── frontend/
    └── src/
        ├── api/transactions.js   ← Axios API calls
        ├── utils/constants.js    ← Categories, formatters
        ├── components/           ← Reusable UI components
        ├── pages/                ← Dashboard, Transactions, Reports
        └── App.jsx               ← Router + layout
```

## ✨ Features
- ✅ Dashboard with summary cards + 3 charts
- ✅ Add / Edit / Delete transactions (full CRUD)
- ✅ Search + filter by type, category, date range
- ✅ Monthly reports with category breakdown table
- ✅ Indian Rupee (₹) formatting throughout
- ✅ Responsive — works on mobile, tablet, desktop
- ✅ Data persists in MongoDB Atlas
