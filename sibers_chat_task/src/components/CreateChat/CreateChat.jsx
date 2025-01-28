import React, { useState } from "react";
import "./CreateChat.css";
import closeIcon from "../../assets/close.svg";

function CreateChat({ adminUsername, users, onClose, onChatCreated }) {
  // State to store the chat name
  const [chatName, setChatName] = useState("");

  // State to store the selected participants
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // State to store the search query for filtering users
  const [searchQuery, setSearchQuery] = useState("");

  // State to store any warning messages
  const [warning, setWarning] = useState("");

  // If users are not loaded or the list is empty, display a loading message
  if (!users || users.length === 0) {
    return (
      <div
        id="create-chat-backdrop"
        className="create-chat-backdrop"
        onClick={onClose}
      >
        <div>Loading users...</div>
      </div>
    );
  }

  // Handler for toggling the selection of a participant
  const handleParticipantChange = (username) => {
    setSelectedParticipants((prev) =>
      prev.includes(username)
        ? prev.filter((name) => name !== username)
        : [...prev, username]
    );
  };

  // Handler for creating a new chat
  const handleCreateChat = () => {
    if (!chatName.trim()) {
      setWarning("Chat name cannot be empty.");
      return;
    }

    const chatData = {
      name: chatName,
      participants: [adminUsername, ...selectedParticipants],
    };

    onChatCreated(chatData);
  };

  // Filter users based on the search query and exclude the admin user
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.username !== adminUsername
  );

  return (
    <div
      id="create-chat-backdrop"
      className="create-chat-backdrop"
      onClick={onClose}
    >
      <div
        className="create-chat-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        {/* Title */}
        <h2 className="create-chat-title">Create Chat</h2>
        {/* Input for chat name */}
        <input
          type="text"
          placeholder="Chat Name"
          value={chatName}
          onChange={(e) => {
            setChatName(e.target.value);
            setWarning("");
          }}
          className="create-chat-input"
        />
        {/* Display warning message if any */}
        {warning && <p className="warning">{warning}</p>}
        {/* Input for searching users */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="create-chat-search"
        />
        {/* List of participants */}
        <div className="participants">
          {filteredUsers.map((user) => (
            <label
              key={user.id}
              className={
                selectedParticipants.includes(user.username) ? "selected" : ""
              }
              onClick={() => handleParticipantChange(user.username)}
            >
              {user.username}
            </label>
          ))}
        </div>
        {/* Button to create the chat */}
        <button
          onClick={handleCreateChat}
          className="create-chat-button-submit"
        >
          Create Chat
        </button>
      </div>
    </div>
  );
}

export default CreateChat;
