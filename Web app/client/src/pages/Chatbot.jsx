import { useState } from "react";
import axios from "axios";
import "../themes/chatbot.css"; 

const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post(`${API}/api/chatbot`, { message: userMessage.text });
      const botReply = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "Error: Could not connect to AI." }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-log">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.from}`}>
            <strong>{msg.from === "user" ? "You" : "Vincent Ai"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VHA anything..."
          onKeyDown={(e) => e.key === "Enter" ? sendMessage() : null}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
