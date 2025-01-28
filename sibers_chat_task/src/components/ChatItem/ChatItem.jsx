import React from "react";
import "./ChatItem.css";
import chatIcon from "../../assets/group.svg";

function ChatItem({ name, filterMode, sender, description, onClick }) {
  // Function to truncate the description if it exceeds 50 characters
  const getTruncatedDesc = (description) => {
    if (description.length > 50) {
      return description.substring(0, 50) + "...";
    }
    return description;
  };

  return (
    <div className="chat-item" onClick={onClick}>
      {/* Chat icon */}
      <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
      <div className="chat-info">
        {/* Chat name */}
        <h3 className="chat-name">{name}</h3>
        {/* Conditional rendering based on filterMode */}
        {filterMode === "myChats" && (
          <p className="chat-description">
            {/* Sender's name in blue text */}
            <span className="blue-text">{sender}</span>
            {description ? (
              <>
                {/* Colon in blue text */}
                <span className="blue-text">: </span>
                {/* Truncated description */}
                {getTruncatedDesc(description)}
              </>
            ) : (
              // Default message if no description is available
              "Write a message"
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
