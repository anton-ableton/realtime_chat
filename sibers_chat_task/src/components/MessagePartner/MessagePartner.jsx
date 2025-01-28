import React from "react";
import "./MessagePartner.css";
import avatarIcon from "../../assets/user.svg";
import { getFormattedTime } from "../../utils/getFormattedTime";

function MessagePartner({ sender, text, time }) {
  // This component displays a message sent by a partner (another user)
  return (
    <div className="message-partner">
      {/* Avatar icon */}
      <img src={avatarIcon} alt="Avatar" className="avatar" />
      <div className="message-partner-content">
        {/* Sender's name */}
        <p className="message-partner-sender">{sender}</p>
        {/* Message text */}
        <p className="message-partner-text">{text}</p>
        {/* Message timestamp */}
        <span className="message-partner-time">{getFormattedTime(time)}</span>
      </div>
    </div>
  );
}

export default MessagePartner;
