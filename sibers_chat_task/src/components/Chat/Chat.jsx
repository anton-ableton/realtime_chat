import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigateBar from "../NavigateBar/NavigateBar";
import ChatList from "../ChatList/ChatList";
import ChatWindow from "../ChatWindow/ChatWindow";
import ChooseChat from "../ChooseChat/ChooseChat";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Chat.css";
import { io } from "socket.io-client";

function Chat({ users }) {
  // Extract the state from the location object
  const { state } = useLocation();

  // State to keep track of the selected chat
  const [selectedChat, setSelectedChat] = useState(null);

  // State to keep track of the filter mode for chats
  const [filterMode, setFilterMode] = useState("myChats");

  // State to store the list of chats
  const [chats, setChats] = useState([]);

  // State to store the socket connection
  const [socket, setSocket] = useState(null);

  // State to store the selected user
  const [selectedUser, setSelectedUser] = useState(state?.user);

  useEffect(() => {
    // Initialize the socket connection
    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });
    setSocket(socket);

    // Event listener for when the socket connects
    socket.on("connect", () => {
      // Emit an event to get the list of chats
      socket.emit("getChats");
    });

    // Event listener for receiving the list of chats
    socket.on("chats", (chats) => {
      setChats(chats);
    });

    // Event listener for receiving a new message
    socket.on("message", (message) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              messages: [...chat.messages, message],
            };
          }
          return chat;
        })
      );

      // Update selectedChat if the message belongs to the selected chat
      if (selectedChat && selectedChat._id === message.chatId) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, message],
        }));
      }
    });

    // Event listener for when a participant is added to a chat
    socket.on("participantAdded", ({ chatId, participant }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              participants: [...chat.participants, participant],
            };
          }
          return chat;
        })
      );

      // Update selectedChat if the participant was added to the selected chat
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          participants: [...prevChat.participants, participant],
        }));
      }

      // Force re-filtering of ChatList
      setFilterMode((prevFilterMode) => prevFilterMode);
      setSelectedUser((prevSelectedUser) => ({ ...prevSelectedUser }));
    });

    // Event listener for when a participant is removed from a chat
    socket.on("participantRemoved", ({ chatId, participant }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              participants: chat.participants.filter((p) => p !== participant),
            };
          }
          return chat;
        })
      );

      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          participants: prevChat.participants.filter((p) => p !== participant),
        }));
      }
    });

    // Event listener for when the socket disconnects
    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    // Cleanup function to close the socket connection
    return () => {
      socket.close();
    };
  }, [selectedChat]);

  // Handler for selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  // Handler for deleting a chat
  const handleChatDelete = (chatId) => {
    socket.emit("deleteChat", chatId);
    if (selectedChat && selectedChat._id === chatId) {
      setSelectedChat(null);
    }
  };

  // Handler for removing a participant from a chat
  const handleParticipantRemove = (chatId, participant) => {
    socket.emit("removeParticipant", { chatId, participant });
  };

  return (
    <div className="chat-container">
      {/* Navigation bar component */}
      <NavigateBar selectedUser={selectedUser} setFilterMode={setFilterMode} />
      {/* Resizable panel group for chat list and chat window */}
      <PanelGroup direction="horizontal" className="chat-windows">
        <Panel defaultSize={25} minSize={20} maxSize={50}>
          {/* Chat list component */}
          <ChatList
            onChatSelect={handleChatSelect}
            users={users}
            filterMode={filterMode}
            selectedUser={selectedUser}
            chats={chats}
            socket={socket}
            selectedChat={selectedChat}
          />
        </Panel>
        {/* Resize handle for the panels */}
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={75} minSize={50} maxSize={80}>
          {/* Conditional rendering of ChooseChat or ChatWindow component */}
          {!selectedChat ? (
            <ChooseChat />
          ) : (
            <ChatWindow
              selectedChat={selectedChat}
              userId={selectedUser.username}
              onChatDelete={handleChatDelete}
              onParticipantRemove={handleParticipantRemove}
              socket={socket}
            />
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Chat;
