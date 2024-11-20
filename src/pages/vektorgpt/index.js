import React, { useState } from "react";
import "./VektorGPTPage.css"; // Importing the CSS file
import SendButton from "../../assets/svgs/up-button.svg"; // Importing the SVG file
import AIBotIcon from "../../assets/svgs/bot-svgrepo-com.svg"; // Importing the chatbot icon


const VektorGPT = () => {
  const [messages, setMessages] = useState([]); // State to manage chat messages
  const [input, setInput] = useState(""); // State to manage the input field
  const [showConversation, setShowConversation] = useState(false); // State to toggle conversation container

  // Handle send button click
  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input.trim() };
      const botResponse = { sender: "bot", text: "Hello! How can I assist you today? 😊" };

      // Update the messages list with user input and bot response
      setMessages((prevMessages) => [...prevMessages, userMessage, botResponse]);
      setInput(""); // Clear the input field
      setShowConversation(true); // Show the conversation container
    }
  };

  return (
    <div className={`feedback-container ${showConversation ? "conversation-active" : ""}`}>
      {/* Heading */}
      {!showConversation && <h2 className="feedback-heading">What can I help with?</h2>}

      {/* Chat Area - Only visible after the first message */}
      {showConversation && (
        <div className="chat-area">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.sender === "user" ? "user-message" : "bot-message"}`}
            >
              {message.sender === "bot" && (
                // <div className="bot-avatar">
                //   <img
                //     src="https://via.placeholder.com/40" // Replace with actual bot avatar if needed
                //     alt="Bot Avatar"
                //   />
                // </div>

                <div className="bot-avatar">
                  <img src={AIBotIcon} alt="Bot Avatar" className="bot-icon" />
                </div>
              )}
              <div className="chat-text">{message.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className={`feedback-input-wrapper ${showConversation ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Message VektorGPT"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="feedback-input"
        />
        <button className="feedback-send-button" onClick={handleSend}>
          <img src={SendButton} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default VektorGPT;
