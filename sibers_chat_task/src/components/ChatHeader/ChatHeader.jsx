import React, { useState, useEffect } from "react";
import "./ChatHeader.css";
import chatIcon from "../../assets/group.svg";
import ChatInfo from "../ChatInfo/ChatInfo";

function ChatHeader({
  name,
  participants,
  chatId,
  onChatDelete,
  onParticipantRemove,
  userId,
  socket,
}) {
  // State to control the visibility of the chat info modal
  const [showChatInfo, setShowChatInfo] = useState(false);

  // State to keep track of the current participants in the chat
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  // Effect to update the current participants whenever the participants prop changes
  useEffect(() => {
    setCurrentParticipants(participants);
  }, [participants]);

  // Handler for deleting the chat
  const handleDeleteChat = () => {
    onChatDelete(chatId);
    setShowChatInfo(false);
  };

  // Handler for removing a participant from the chat
  const handleRemoveParticipant = (participant) => {
    onParticipantRemove(chatId, participant);
    setCurrentParticipants(
      currentParticipants.filter((p) => p !== participant)
    );
  };

  return (
    <div className="chat-header" onClick={() => setShowChatInfo(true)}>
      {/* Chat icon */}
      <img src={chatIcon} alt="Chat Icon" className="chat-header-icon" />
      <div className="chat-info">
        {/* Chat name */}
        <h3 className="chat-name">{name}</h3>
        {/* Number of participants in the chat */}
        <p className="chat-members">{currentParticipants.length} members</p>
      </div>
      {/* Conditional rendering of the ChatInfo component */}
      {showChatInfo && (
        <ChatInfo
          chat={{
            name,
            participants: currentParticipants,
            admin: participants[0],
            _id: chatId,
          }}
          onClose={() => setShowChatInfo(false)}
          onDeleteChat={handleDeleteChat}
          onRemoveParticipant={handleRemoveParticipant}
          userId={userId}
          socket={socket}
        />
      )}
    </div>
  );
}

export default ChatHeader;
