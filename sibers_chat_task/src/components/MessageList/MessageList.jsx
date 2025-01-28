import React, { useEffect, useRef } from "react";
import MessageOwn from "../MessageOwn/MessageOwn";
import MessagePartner from "../MessagePartner/MessagePartner";
import "./MessageList.css";

function MessageList({ messages, userId }) {
  // Ref to the message list container for scrolling
  const messageListRef = useRef(null);

  // Effect to scroll to the bottom of the message list when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="message-list">
      {/* Map through messages and render MessageOwn or MessagePartner components */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={
            message.sender === userId ? "own-message" : "partner-message"
          }
        >
          {message.sender === userId ? (
            <MessageOwn text={message.text} time={message.timestamp} />
          ) : (
            <MessagePartner
              sender={message.sender}
              text={message.text}
              time={message.timestamp}
            />
          )}
        </div>
      ))}
      {/* Empty div to act as a reference for scrolling */}
      <div ref={messageListRef}></div>
    </div>
  );
}

export default MessageList;
