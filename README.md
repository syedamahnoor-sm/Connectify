# 🌐 Connectify

> **Connectify** is a modern full-stack social networking platform built using the **MERN Stack**. It enables users to create posts, interact through likes and comments, follow other users, exchange real-time messages, and receive live notifications—all within a responsive and intuitive user interface.

Designed with scalability, performance, and clean architecture in mind, Connectify demonstrates production-level full-stack development using modern web technologies.

---

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication
- Secure user registration & login
- Password hashing using bcrypt
- Protected routes & middleware
- Persistent user sessions

---

### 📝 Posts & Feed

- Create, edit & delete posts
- Upload post images using Cloudinary
- Dynamic social feed
- Optimistic UI updates
- Responsive post rendering

---

### ❤️ Social Interactions

- Like & Unlike posts
- Add, edit & delete comments
- Instant interaction updates
- Real-time UI synchronization

---

### 👤 User Profiles

- View and edit profile information
- Upload profile & cover images
- Followers & Following system
- Personal bio & user details
- View other users' profiles

---

### 🤝 Social Networking

- Follow / Unfollow users
- Suggested users
- Profile navigation
- Personalized social experience

---

### 💬 Real-Time Messaging

- One-to-one private messaging
- Live chat using Socket.io
- Instant message delivery
- Conversation updates
- Seen message status
- Online user detection

---

### 🔔 Real-Time Notifications

- Like notifications
- Comment notifications
- Follow notifications
- Message notifications
- Live notification badge updates
- Read / unread notification management
- Socket.io powered real-time notification delivery

---

### 🎨 User Experience

- Fully responsive design
- Modern UI built with Tailwind CSS
- Smooth animations & transitions
- Mobile-friendly layout
- Clean component architecture
- Optimized rendering for better performance

---

# 🛠 Tech Stack

## Frontend

- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Real-Time Communication

- Socket.io

## Media Storage

- Cloudinary

---

# 📂 Project Structure

```text
connectify/
│
├── client/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── socket.js
│   └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/connectify.git
cd connectify
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# 🚀 Key Concepts Demonstrated

- Full-Stack MERN Development
- RESTful API Development
- JWT Authentication & Authorization
- MongoDB Data Modeling
- Real-Time Communication with Socket.io
- Cloudinary Image Uploads
- Responsive UI Design
- State Management
- Component-Based Architecture
- Production-Level Project Structure

---

# 📱 Responsive Design

Connectify is optimized for:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

The application uses responsive layouts and modern UI practices to provide a seamless experience across different screen sizes.

---

# 🎯 Learning Outcomes

- Building scalable MERN applications
- Authentication & Authorization
- REST API development
- MongoDB schema design
- Real-time communication
- Media upload & storage
- React architecture & state management
- Responsive UI development
- Socket.io integration
- Production-ready project organization

---

# 🚀 Future Improvements

- 🔍 Global user & post search
- 📸 Stories feature
- 📌 Saved posts
- 🔄 Infinite scrolling
- 💬 Group messaging
- 🎥 Voice & video calling
- 🌙 Dark mode
- 📱 Progressive Web App (PWA)
- 🔔 Push notifications
- 📊 User analytics dashboard

---

# 👩‍💻 Author

**Syeda Mahnoor**

Software Engineering Student • MERN Stack Developer

---

## ⭐ If you found this project helpful, consider giving it a star!
