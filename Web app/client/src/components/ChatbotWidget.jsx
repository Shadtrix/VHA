import { useState, useContext } from "react";
import axios from "axios";
import ChatbotContext from "../contexts/ChatbotContext.jsx";
import "../components/chatbot.css";
import UserContext from "../contexts/UserContext";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, addMessage, clearMessages } = useContext(ChatbotContext);
  const { user } = useContext(UserContext);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    addMessage(userMsg);
    setInput("");

    try {
      const res = await axios.post("http://localhost:3001/api/chatbot", {
        message: input,
      });
      const botReply = { from: "bot", text: res.data.reply };
      addMessage(botReply);
    } catch (err) {
      addMessage({ from: "bot", text: " AI failed to respond." });
    }
  };

  return (
    <div className="chatbot-widget">
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <strong>VHA Assistant</strong>
            <div>
              <button onClick={clearMessages} style={{ marginRight: "8px" }}>
                🗑 Clear
              </button>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                <strong>
                  {msg.from === "user"
                    ? user?.name || "You"
                    : "Vincent Ai"}
                  :
                </strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              placeholder="Ask me anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

