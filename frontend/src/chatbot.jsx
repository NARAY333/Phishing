import React, { useState, useEffect } from "react";
import "./chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    const chatWindow = document.querySelector(".chatbot-messages");
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    const messageToSend = input; 
    setInput("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot fetch error:", error);
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong!" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">AI Assistant</div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
