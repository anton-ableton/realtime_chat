import React from "react";
import "./MessageOwn.css";
import { getFormattedTime } from "../../utils/getFormattedTime";

function MessageOwn({ text, time }) {
  // This component displays a message sent by the current user
  return (
    <div className="message-own">
      <div className="message-own-content">
        {/* Message text */}
        <p className="message-own-text">{text}</p>
        {/* Message timestamp */}
        <span className="message-own-time">{getFormattedTime(time)}</span>
      </div>
    </div>
  );
}

export default MessageOwn;
