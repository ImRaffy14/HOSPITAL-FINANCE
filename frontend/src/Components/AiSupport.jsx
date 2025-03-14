import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios"

const AiSupport = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I assist you today?" },

  ]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false)
  const chatRef = useRef(null);


  const urlAPI = import.meta.env.VITE_API_URL

  useEffect(() => {
    // Scroll to the latest message
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prevData) => [...prevData, { sender: "user", text: input }]);
    setInput('')
    setIsReplying(true)
    const response = await axios.post(`${urlAPI}/ai/prompt-ai`, { query: input })
    setIsReplying(false)
    setMessages((prevData) => [...prevData, { sender: "ai", text: response.data }]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white text-lg font-semibold p-4 text-center shadow-md">
        AI Chat Decision Support
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-[75%] rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatRef} />
      </div>
        
    
        {/* AI Typing Animation */}
        {isReplying && (
            <div className="mb-5 ml-5 flex justify-start">
            <div className="p-3 bg-white text-gray-800 rounded-lg shadow-md flex space-x-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-150">•</span>
                <span className="animate-bounce delay-300">•</span>
            </div>
            </div>
        )}
      {/* Input Field */}
      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          className="flex-1 p-3 border rounded-full shadow-sm outline-none text-gray-700"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
          onClick={handleSend}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default AiSupport;
