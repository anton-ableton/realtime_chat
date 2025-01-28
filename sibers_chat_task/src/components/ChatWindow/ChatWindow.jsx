import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import MessageList from "../MessageList/MessageList";
import ChatHeader from "../ChatHeader/ChatHeader";
import "./ChatWindow.css";
import sendIcon from "../../assets/send.svg";
import emojiIcon from "../../assets/emoji.svg";

function ChatWindow({
  selectedChat,
  userId,
  onChatDelete,
  onParticipantRemove,
  socket,
}) {
  // State to control the visibility of the emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // State to store the message input
  const [messageInput, setMessageInput] = useState("");

  // State to store the current chat
  const [chat, setChat] = useState(selectedChat);

  // Ref to store the timeout for the emoji picker
  const emojiPickerTimeout = useRef(null);

  // State to check if the user is a participant of the chat
  const [isParticipant, setIsParticipant] = useState(
    selectedChat.participants.includes(userId)
  );

  // Effect to update the chat and participant status when selectedChat changes
  useEffect(() => {
    setChat(selectedChat);
    setIsParticipant(selectedChat.participants.includes(userId));
  }, [selectedChat]);

  // Effect to update the participant status when the chat or userId changes
  useEffect(() => {
    if (chat) {
      setIsParticipant(chat.participants.includes(userId));
    }
  }, [chat, userId]);

  // Effect to handle participant removal
  useEffect(() => {
    const handleParticipantRemoved = ({ chatId, participant }) => {
      if (chatId === chat._id) {
        setChat((prevChat) => ({
          ...prevChat,
          participants: prevChat.participants.filter((p) => p !== participant),
        }));
        if (participant === userId) {
          setIsParticipant(false);
        }
      }
    };

    socket.on("participantRemoved", handleParticipantRemoved);

    return () => {
      socket.off("participantRemoved", handleParticipantRemoved);
    };
  }, [chat, userId, socket]);

  // Effect to handle participant removal in the parent component
  useEffect(() => {
    if (onParticipantRemove) {
      const handleParticipantRemove = () => {
        setIsParticipant(false);
      };
      onParticipantRemove(handleParticipantRemove);
    }
  }, [onParticipantRemove]);

  // Handler for selecting an emoji
  const handleEmojiSelect = (emojiObject) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Function to send a message
  const sendMessage = (message) => {
    if (message.trim() !== "" && isParticipant) {
      const newMessage = {
        chatId: selectedChat._id,
        text: message,
        sender: userId,
        timestamp: new Date(),
      };
      socket.emit("message", newMessage);
      setMessageInput("");
    } else {
      alert(
        "You are not a participant of this chat. Please join the chat to send messages."
      );
    }
  };

  // Handler for showing the emoji picker on mouse enter
  const handleMouseEnter = () => {
    setShowEmojiPicker(true);
    if (emojiPickerTimeout.current) {
      clearTimeout(emojiPickerTimeout.current);
    }
  };

  // Handler for hiding the emoji picker on mouse leave
  const handleMouseLeave = () => {
    emojiPickerTimeout.current = setTimeout(() => {
      setShowEmojiPicker(false);
    }, 700);
  };

  // Handler for joining the chat
  const handleJoinChat = async () => {
    try {
      socket.emit("addParticipant", {
        chatId: selectedChat._id,
        participant: userId,
      });
      setIsParticipant(true);
      setChat((prevChat) => ({
        ...prevChat,
        participants: [...prevChat.participants, userId],
      }));
    } catch (err) {
      console.error("Error joining chat:", err);
      alert("Error joining chat");
    }
  };

  // Loading state
  if (!chat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-window">
      <ChatHeader
        name={chat.name}
        participants={chat.participants}
        chatId={chat._id}
        onChatDelete={onChatDelete}
        onParticipantRemove={onParticipantRemove}
        userId={userId}
        socket={socket}
      />
      {isParticipant ? (
        <>
          <MessageList messages={chat.messages} userId={userId} />
          <div
            className="message-input"
            onKeyDown={(e) => e.key === "Enter" && sendMessage(messageInput)}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div
              className="emoji-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={emojiIcon} alt="Emoji" className="emoji-button" />
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
            <div
              className="send-container"
              onClick={() => sendMessage(messageInput)}
            >
              <img src={sendIcon} alt="Send" className="send-button" />
            </div>
          </div>
        </>
      ) : (
        <button className="join-button" onClick={handleJoinChat}>
          Join Chat
        </button>
      )}
    </div>
  );
}

export default ChatWindow;
