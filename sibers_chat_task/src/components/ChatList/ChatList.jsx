import React, { useState, useEffect } from "react";
import ChatItem from "../ChatItem/ChatItem";
import "./ChatList.css";
import plusIcon from "../../assets/plus.svg";
import CreateChat from "../CreateChat/CreateChat";

function ChatList({
  onChatSelect,
  users,
  filterMode,
  selectedUser,
  chats,
  socket,
}) {
  // State to control the visibility of the CreateChat component
  const [showCreateChat, setShowCreateChat] = useState(false);

  // Handler for creating a new chat
  const handleCreateChat = (chatData) => {
    socket.emit("createChat", chatData);
    setShowCreateChat(false);
  };

  // Filter chats based on the filterMode
  const filteredChats = chats.filter((chat) => {
    if (filterMode === "myChats") {
      return chat.participants.includes(selectedUser.username);
    } else if (filterMode === "availableChats") {
      return !chat.participants.includes(selectedUser.username);
    }
    return true;
  });

  return (
    <div className="chat-list-container">
      <div className="chat-list">
        {/* Map through filtered chats and render ChatItem components */}
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat._id}
            name={chat.name}
            filterMode={filterMode}
            sender={
              (chat.messages[chat.messages.length - 1]?.sender ===
              selectedUser.username
                ? "You"
                : chat.messages[chat.messages.length - 1]?.sender) || ""
            }
            description={chat.messages[chat.messages.length - 1]?.text || ""}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>
      {/* Button to open the CreateChat component */}
      <button
        title="Create Chat"
        className="create-chat-button"
        onClick={() => setShowCreateChat(true)}
      >
        <img src={plusIcon} alt="Create Chat" />
      </button>
      {/* Conditional rendering of the CreateChat component */}
      {showCreateChat && (
        <CreateChat
          adminUsername={selectedUser.username}
          users={users}
          onClose={() => setShowCreateChat(false)}
          onChatCreated={handleCreateChat}
        />
      )}
    </div>
  );
}

export default ChatList;
