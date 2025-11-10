# RBAC Application

A full-stack MERN (MongoDB, Express, React, Node.js) application with fine-grained Role-Based Access Control (RBAC) and JWT authentication.

## Features

* JWT-based authentication with access and refresh tokens
* HttpOnly cookies for secure token storage
* Role-based permissions (Admin, Editor, Viewer)
* Fine-grained access control with ownership checks
* Password hashing with bcrypt
* Express.js REST API with Mongoose
* React 18 with Hooks and Protected Routes
* Audit logging for sensitive actions

## Technologies Used

**Backend**
* Node.js
* Express.js
* MongoDB
* Mongoose
* jsonwebtoken
* bcryptjs
* express-validator

**Frontend**
* React 18
* React Router v6
* Axios

### Prerequisites
* Node.js (v16 or higher)
* MongoDB (v5 or higher)

### Installation

1.  Clone the repository
    git clone <repository-url>
    cd mern-rbac-app

2.  Install backend dependencies
    npm install

3.  Install frontend dependencies
    cd client
    npm install

4.  Create environment file
    copy .env.example .env

5.  Update `.env` with your configuration:
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/rbac-app
    JWT_SECRET=your-super-secret-jwt-key-change-in-production
    JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
    CORS_ORIGIN=http://localhost:3000

### Running Locally

1.  Start your MongoDB service.

2.  Seed the database (for demo accounts):
    npm run seed

3.  Start the backend server:
    npm run server

4.  Start the frontend (in a new terminal):
    cd client
    npm start
    
The application will be available at `http://localhost:3000`.
