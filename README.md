# 🎬 Video Streaming App - A YouTube Clone (MERN Stack)

**Video Streaming** is a full-stack video sharing and streaming platform inspired by YouTube. Users can upload videos, watch content, like, comment, and manage playlists — all in a seamless experience built using the MERN stack.

---

## 🚀 Features

- 🔐 User Authentication & Authorization  
- 📤 Video Upload with Thumbnail Support  
- 📺 Stream Videos with Built-in Player  
- ❤️ Like, Comment & Interact with Videos  
- 📁 Create and Manage Playlists  
- 🔎 Search and Filter Content  
- 👤 User Profile with Uploaded Content  

---

## 🛠️ Tech Stack

**Frontend**:
- React.js  
- Axios  
- React Router DOM  
- Tailwind CSS or Bootstrap  

**Backend**:
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Multer (for file uploads)  
- Session/JWT for Authentication  
- dotenv for Environment Variables  

---

## 📂 Project Structure

Video Streaming/
│
├── .gitignore
├── backend/
│   ├── controllers/
│   ├── db/ 
│   ├── middlewares/ 
│   ├── models/ 
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
└── ...


---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ghuge123/video-streaming.git
cd video-streaming
cd backend
npm install
```
### 2. Setup Backend

```bash
cd backend
npm install
```
### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

### 4.  Environment Variables

Create a .env file inside the backend/ directory with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

--- 

## 🌐 Deployment
Frontend: Vercel 

Backend: Render

Database: MongoDB Atlas

---

## 🙌 Author
Made with ❤️ by Dipak Ghuge



