import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";

const ChatInterface = () => {
    const [messages, setMessages] = useState([]); // Initialize with an empty array
    const [input, setInput] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const chatRef = useRef(null);

    const urlAPI = import.meta.env.VITE_API_URL;

    // Load chat history from localStorage when the component mounts
    useEffect(() => {
        const savedChats = localStorage.getItem("chatHistory");
        if (savedChats) {
            setMessages(JSON.parse(savedChats));
        } else {
            // Initialize with a default AI message if no history exists
            setMessages([{ sender: "ai", text: "Hello! How can I assist you today?" }]);
        }
    }, []);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(messages));
    }, [messages]);

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add the user's message to the chat
        const updatedMessages = [...messages, { sender: "user", text: input }];
        setMessages(updatedMessages);
        setInput("");
        setIsReplying(true);

        try {
            // Send the user's message to the AI API
            const response = await axios.post(`${urlAPI}/ai/prompt-ai`, { query: input });
            setIsReplying(false);

            // Add the AI's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "ai", text: response.data },
            ]);
        } catch (error) {
            setIsReplying(false);
            console.error("Error sending message to AI:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "ai", text: "Sorry, something went wrong. Please try again." },
            ]);
        }
    };

    // Clear chat history (optional)
    const clearChatHistory = () => {
        localStorage.removeItem("chatHistory");
        setMessages([{ sender: "ai", text: "Hello! How can I assist you today?" }]);
    };

    return (
        <div className="fixed bottom-20 right-6 w-[500px] h-[400px] bg-white shadow-lg rounded-lg flex flex-col">
            <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
                <h2 className="text-lg font-semibold">AI Support Chat</h2>
                <button
                    className="text-white hover:text-gray-200"
                    onClick={clearChatHistory} // Optional: Add a button to clear chat history
                >
                    ✕
                </button>
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

export default ChatInterface;