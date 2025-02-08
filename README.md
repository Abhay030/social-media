# Secure Blog Platform  

A simple yet powerful blog platform built with **Node.js, Express.js, and MongoDB**, featuring user authentication, post creation, and like/unlike functionality.

## 🚀 Features  

- **User Authentication** – Secure login and logout using **JWT authentication**.  
- **Post Management** – Users can **create and edit** their own posts.  
- **Like & Unlike** – Users can **like/unlike** posts dynamically.  
- **Authorization** – Only authenticated users can interact with posts.  
- **MongoDB Integration** – All data is stored and retrieved from a **MongoDB database**.  

---

## 🛠️ Installation & Setup  

### **1. Clone the Repository**  
```sh
git clone https://github.com/yourusername/repository-name.git
cd repository-name
```
### 2. Install Dependencies
```sh
npm install
```
### 3. Set Up Environment Variables
Create a .env file in the root directory and add the following:
```sh
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### 4. Run the Server
```sh
npm start
```

The server will start at http://localhost:3000.

--- 

# 🔥 API Endpoints
### Authentication Routes
- POST /register → Register a new user
- POST /login → Login and receive a JWT token
- POST /logout → Logout the user
# Post Management
- POST /posts → Create a new post
- PUT /posts/:id → Edit a post
- DELETE /posts/:id → Delete a post
- POST /posts/:id/like → Like/Unlike a post

---

# 🎯 Future Enhancements

- **✅ Comment System** – Allow users to comment on posts.
- **✅ User Profiles** – Add user bio, profile pictures, and social links.
- **✅ Image Uploads** – Enable users to add images to their posts.
- **✅ Notifications** – Notify users when their post gets a like or comment.
- **✅ Pagination** – Improve post loading speed with paginated requests.

--- 

# 📌 Extra Notes

- The project follows MVC architecture for better code organization.
- Uses bcrypt.js for password hashing to enhance security.
- Includes error handling and validation for API requests.

---

# 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.




