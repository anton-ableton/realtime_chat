import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/sibers_chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const chatSchema = new mongoose.Schema({
  name: String,
  admin: String,
  participants: [{ type: String }],
  messages: [
    {
      text: String,
      sender: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

// Route to get user data
app.get("/api/users", (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, "users.json");

  console.log(filePath);
  console.log(filePath);
  console.log(filePath);
  console.log(filePath);
  console.log(filePath);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res.status(500).json({ error: "Error reading users file" });
    }
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (parseErr) {
      console.error("Error parsing users file:", parseErr);
      res.status(500).json({ error: "Error parsing users file" });
    }
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New Socket.IO connection");

  // Get the list of chats
  socket.on("getChats", async () => {
    try {
      const chats = await Chat.find();
      socket.emit("chats", chats);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  });

  // Create a new chat
  socket.on("createChat", async (data) => {
    const { name, participants } = data;
    try {
      const chat = new Chat({ name, participants });
      await chat.save();
      const chats = await Chat.find();
      io.emit("chats", chats);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  });

  // Remove a participant from a chat
  socket.on("removeParticipant", async (data) => {
    const { chatId, participant } = data;
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return;
      }
      chat.participants = chat.participants.filter((p) => p !== participant);
      await chat.save();
      const chats = await Chat.find();
      io.emit("chats", chats);
    } catch (err) {
      console.error("Error removing participant:", err);
    }
  });

  // Add a participant to a chat
  socket.on("addParticipant", async (data) => {
    const { chatId, participant } = data;
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return;
      }
      if (!chat.participants.includes(participant)) {
        chat.participants.push(participant);
        await chat.save();
        const chats = await Chat.find();
        io.emit("chats", chats);
        io.emit("participantAdded", { chatId, participant });
      }
    } catch (err) {
      console.error("Error adding participant:", err);
    }
  });

  // Delete a chat
  socket.on("deleteChat", async (chatId) => {
    try {
      await Chat.findByIdAndDelete(chatId);
      const chats = await Chat.find();
      io.emit("chats", chats);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  });

  // Send a message
  socket.on("message", async (message) => {
    console.log("Received message:", message);
    const { chatId, text, sender } = message;
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return;
      }
      chat.messages.push({ text, sender, timestamp: new Date() });
      await chat.save();

      console.log("Message saved:", {
        chatId,
        text,
        sender,
        timestamp: new Date(),
      });

      io.emit("message", { chatId, text, sender, timestamp: new Date() });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
