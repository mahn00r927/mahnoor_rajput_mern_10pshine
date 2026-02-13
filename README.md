# 🧠 Smart Notes

## 📌 Overview

**Smart Notes** is a secure, full-stack note-taking application designed to help users create, edit, and manage personal notes in a private workspace.

Built with modern technologies and following industry-standard practices, the application ensures data security, reliability, and scalability. Each user has a private account, and notes are only accessible to the authenticated user.

---

## ✨ Features

* 🔐 **Authentication:** Signup & login using JWT
* 📝 **Note Management:** Create, edit, update, and delete notes
* 👤 **User-Specific Notes:** Each user’s notes are private
* 🚀 **Secure RESTful APIs**
* 🗄 **Database Integration:** MongoDB for persistent storage
* 📊 **Structured Logging:** Pino Logger for high-performance logging
* ⚠️ **Centralized Error Handling** for clean and consistent API responses
* 🧪 **Backend Testing:** Mocha & Chai
* 🧪 **Frontend Testing:** Vitest

---

## 🛠 Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vitest (Testing)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JSON Web Tokens (JWT)

### Logging

* Pino Logger

### Testing

* Backend: Mocha & Chai
* Frontend: Vitest

---

## 📁 Project Structure

```
Smart-Notes/
├── frontend/      → React + TypeScript frontend
├── backend/       → Node.js + Express backend
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd Smart-Notes
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Environment Variables (`backend/.env`):**

# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=<your_mongodb_connection_string>

# Authentication
JWT_SECRET=<your_jwt_secret>

# Email (for notifications)
GMAIL_USER=<your_email>
GMAIL_APP_PASSWORD=<your_email_app_password>

# Frontend URL
FRONTEND_URL=http://localhost:5173


Backend will run at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🧪 Running Tests

### Backend (Mocha & Chai)

```bash
cd backend
npm test
```

### Frontend (Vitest)

```bash
cd frontend
npm test
```

---

## 🔐 Authentication Flow

1. User signs up or logs in
2. Backend generates a JWT token
3. Token is stored on the client side (localStorage/sessionStorage)
4. Protected routes validate token before granting access
5. Users can only access their own notes

---

## 📊 Logging & Error Handling

* **Pino Logger** for structured, high-performance logging
* **Centralized Error Handling Middleware** ensures:

  * Consistent API responses
  * Easier debugging
  * Cleaner, maintainable code

---

## 🎯 Project Goals

* Provide a secure, private note management system
* Maintain scalable, clean architecture
* Implement industry-standard backend practices
* Ensure reliability through test-driven development
* Protect user data
