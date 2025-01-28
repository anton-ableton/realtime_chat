import React, { useState } from "react";
import "./NavigateBar.css";
import userIcon from "../../assets/user-nav.svg";
import chatIcon from "../../assets/chat.svg";
import availableChatIcon from "../../assets/available-chat.svg";
import ProfileInfo from "../ProfileInfo/ProfileInfo";

function NavigateBar({ selectedUser, setFilterMode }) {
  // State to control the visibility of the profile info
  const [showProfile, setShowProfile] = useState(false);

  // State to keep track of the active button
  const [activeButton, setActiveButton] = useState("myChats");

  // Function to truncate the username if it exceeds 12 characters
  const getTruncatedUsername = (username) => {
    if (username.length > 12) {
      return username.substring(0, 10) + "...";
    }
    return username;
  };

  // Handler for button clicks to set the active button and filter mode
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setFilterMode(buttonName === "myChats" ? "myChats" : "availableChats");
  };

  return (
    <div className="navigate-bar">
      {/* Profile button */}
      <button
        title="Profile"
        className={`user-button ${activeButton === "profile" ? "active" : ""}`}
        onClick={() => setShowProfile(true)}
      >
        <img className="nav-icon" src={userIcon} alt="User" />
        {selectedUser && (
          <p className="nav-chat-title">
            {getTruncatedUsername(selectedUser.username)}
          </p>
        )}
      </button>
      {/* My Chats button */}
      <button
        className={`chat-button ${activeButton === "myChats" ? "active" : ""}`}
        onClick={() => handleButtonClick("myChats")}
      >
        <img className="nav-icon" src={chatIcon} alt="My Chats" />
        <p className="nav-chat-title">My Chats</p>
      </button>
      {/* Available Chats button */}
      <button
        className={`available-chat-button ${
          activeButton === "availableChats" ? "active" : ""
        }`}
        onClick={() => handleButtonClick("availableChats")}
      >
        <img
          className="nav-icon"
          src={availableChatIcon}
          alt="Available Chats"
        />
        <p className="nav-chat-title">Available Chats</p>
      </button>
      {/* Conditional rendering of the ProfileInfo component */}
      {showProfile && (
        <ProfileInfo
          user={selectedUser}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

export default NavigateBar;
