# Offline Messaging API

A RESTful API for offline messaging built with Node.js, Express, TypeScript, and MySQL.

## Features

- User authentication (register, login)
- Messaging between users
- User blocking functionality
- Activity logging
- Comprehensive error handling
- API documentation with Swagger

## API Usage Scenarios

- Users can create accounts and log in
- Users can message each other as long as they know the username
- Users can access their message history
- Users can block other users to prevent receiving messages
- Activity logs (login, invalid login, etc.) can be viewed by users
- Critical error details are not exposed to users and all errors are logged

## Technical Requirements

- Built with Node.js and TypeScript
- RESTful architecture
- Test coverage of at least 5%
- MySQL database with Sequelize ORM

## Database Design

### Tables

- Users (id, username, email, password, createdAt, updatedAt)
- Messages (id, senderId, receiverId, content, createdAt)
- BlockedUsers (id, blockerId, blockedId, createdAt)
- ActivityLogs (id, userId, action, timestamp)

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login

### User Management

- GET /api/users/:id - Get user information
- GET /api/users/me - Get current user profile
- PUT /api/users/me - Update user profile
- GET /api/users/search - Search users by username

### Messaging

- POST /api/messages - Send a message
- GET /api/messages?userId=2 - Get messages between two users
- GET /api/messages/me - Get all user conversations

### Blocking

- POST /api/block - Block a user
- GET /api/block - Get list of blocked users
- DELETE /api/block/:id - Unblock a user

### Activity Logs

- GET /api/activity - Get user activity logs
- POST /api/activity - Create activity log

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=''
   DB_NAME=chatmessage
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Run the application:
   ```
   npm start
   ```
   
## Development

```
npm run dev
```

## Testing

```
npm test
```

## API Documentation

Swagger documentation is available at `/api-docs` when the server is running.

## License

ISC 