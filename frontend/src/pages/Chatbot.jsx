import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FaPaperPlane, FaRobot, FaUser, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am Eatsy, your CampusEats AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("id");
  const userType = localStorage.getItem("userType");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userId: userId,
          userType: userType,
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message.content }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to connect to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95"
        >
          <FaRobot className="text-3xl" />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl shadow-purple-900/20 flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 flex items-center justify-between shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-xl rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <FaRobot className="text-xl" />
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-tight tracking-wide">Eatsy AI</h1>
                  <p className="text-xs text-purple-100 font-medium">
                    {userType ? `Logged in as ${userType}` : "Guest Mode"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <FaTimes />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {msg.role === "user" ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm overflow-hidden break-words w-full ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
                    }`}
                  >
                    <ReactMarkdown className="prose prose-sm max-w-none break-words">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="self-start flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <FaRobot className="text-sm" />
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Eatsy..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaPaperPlane className="text-xs pr-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
