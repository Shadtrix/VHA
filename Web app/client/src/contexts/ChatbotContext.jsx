import { createContext, useState } from "react";

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatbotContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export default ChatbotContext;
