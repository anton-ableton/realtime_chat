import React, { useState } from "react";
import "./ChatInfo.css";
import starIcon from "../../assets/star.svg";
import closeIcon from "../../assets/close.svg";
import chatIcon from "../../assets/group.svg";
import userIcon from "../../assets/user.svg";

function ChatInfo({
  chat,
  onClose,
  onDeleteChat,
  onRemoveParticipant,
  userId,
  socket,
}) {
  // State to keep track of the participant to be removed
  const [participantToRemove, setParticipantToRemove] = useState(null);

  // State to control the visibility of the delete chat confirmation dialog
  const [showDeleteChatDialog, setShowDeleteChatDialog] = useState(false);

  // State to keep track of the search query for filtering participants
  const [searchQuery, setSearchQuery] = useState("");

  // Handler for removing a participant from the chat
  const handleRemoveParticipant = (participant) => {
    console.log("Removing participant:", participant, chat._id);
    if (socket) {
      socket.emit("participantRemoved", { chatId: chat._id, participant });
    }
    onRemoveParticipant(participant);
    setParticipantToRemove(null);
  };

  // Handler for deleting the chat
  const handleDeleteChat = () => {
    if (socket) {
      socket.emit("deleteChat", chat._id);
    }
    onDeleteChat();
    setShowDeleteChatDialog(false);
  };

  // Filter participants based on the search query
  const filteredParticipants = chat.participants.filter((participant) =>
    participant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-info-overlay" onClick={onClose}>
      <div className="chat-info-container" onClick={(e) => e.stopPropagation()}>
        {/* Chat icon */}
        <img src={chatIcon} alt="Chat Icon" className="chat-info-icon" />
        {/* Chat name */}
        <h3 className="chat-info-name">{chat.name}</h3>
        <div className="chat-info-content">
          {/* Search input for filtering participants */}
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-info-search"
          />
          <div className="chat-info-members-container">
            {/* List of participants */}
            <ul className="chat-info-members">
              {filteredParticipants.map((participant, index) => (
                <li key={index} className="chat-info-member">
                  {/* User icon */}
                  <img
                    src={userIcon}
                    alt="User"
                    className="chat-info-user-icon"
                  />
                  {/* Participant name */}
                  <span className="chat-info-username">{participant}</span>
                  {/* Admin indicator */}
                  {participant === chat.admin ? (
                    <img
                      src={starIcon}
                      alt="Admin"
                      className="chat-info-admin-icon"
                    />
                  ) : (
                    userId === chat.admin && (
                      <button
                        onClick={() => setParticipantToRemove(participant)}
                      >
                        {/* Remove participant button */}
                        <img
                          src={closeIcon}
                          alt="Remove"
                          className="chat-info-remove-icon"
                        />
                      </button>
                    )
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Delete chat button (visible only to the admin) */}
          {userId === chat.admin && (
            <button
              onClick={() => setShowDeleteChatDialog(true)}
              className="chat-info-delete-button"
            >
              Delete Chat
            </button>
          )}
        </div>
        {/* Close button */}
        <button onClick={onClose} className="chat-info-close-button">
          <img src={closeIcon} alt="Close" className="chat-info-close-icon" />
        </button>
      </div>
      {/* Confirmation dialog for removing a participant */}
      {participantToRemove && (
        <div className="confirmation-dialog">
          <p>
            Are you sure you want to remove {participantToRemove} from the chat?
          </p>
          <button onClick={() => handleRemoveParticipant(participantToRemove)}>
            Yes
          </button>
          <button onClick={() => setParticipantToRemove(null)}>No</button>
        </div>
      )}
      {/* Confirmation dialog for deleting the chat */}
      {showDeleteChatDialog && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this chat?</p>
          <button onClick={handleDeleteChat}>Yes</button>
          <button onClick={() => setShowDeleteChatDialog(false)}>No</button>
        </div>
      )}
    </div>
  );
}

export default ChatInfo;
