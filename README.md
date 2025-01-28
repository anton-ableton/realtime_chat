# Realtime Chat

## Overview
Sibers Chat Task is a real-time chat application built using modern web technologies. It allows users to create and join chat rooms, send messages, and manage participants. The application is built with a React frontend and an Express backend, utilizing Socket.IO for real-time communication and MongoDB for data storage.

## Features
- Real-time messaging
- Create and join chat rooms
- Manage chat participants
- User authentication and profile management
- Responsive design for various screen sizes

## Technologies Used
- **Frontend**: React, React Router, Socket.IO Client, Axios
- **Backend**: Express, Socket.IO, Mongoose
- **Database**: MongoDB
- **Build Tools**: Vite, ESLint
- **Other**: Concurrently, Emoji Mart, Emoji Picker React

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (ensure MongoDB service is running)

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/anton-ableton/realtime_chat.git
   cd sibers_chat_task


2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sibers_chat
   ```

4. **Start the application**:
   ```sh
   npm run start:all
   ```
   This command will start the MongoDB service, the Express server, and the Vite development server concurrently.

## Scripts

- **Start MongoDB**:
  ```sh
  npm run start:mongo
  ```

- **Start Express Server**:
  ```sh
  npm run start:server
  ```

- **Start Vite Development Server**:
  ```sh
  npm run start:front
  ```

- **Start All Services**:
  ```sh
  npm run start:all
  ```

- **Build for Production**:
  ```sh
  npm run build
  ```

- **Lint Code**:
  ```sh
  npm run lint
  ```

- **Preview Production Build**:
  ```sh
  npm run preview
  ```

## Project Structure

```
sibers_chat_task/
├── public/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   ├── Welcome/
│   │   ├── ...
│   ├── server/
│   │   ├── server.js
│   │   ├── ...
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .env
├── .eslintrc.js
├── .gitignore
├── package.json
├── README.md
├── vite.config.js
```
