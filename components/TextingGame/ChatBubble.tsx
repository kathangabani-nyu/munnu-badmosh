"use client";

import { motion } from "framer-motion";
import { ChatMessage } from "./types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`
          max-w-[75%] px-4 py-2.5
          ${isUser
            ? "bg-stone-800 text-white/90 rounded-2xl rounded-br-md"
            : "bg-white/80 text-stone-700 rounded-2xl rounded-bl-md shadow-sm border border-stone-200/50"
          }
          text-[0.875rem] leading-relaxed font-sans
        `}
      >
        {message.text && <p>{message.text}</p>}
        {message.attachment && (
          <div className={`${message.text ? "mt-2" : ""} rounded-xl overflow-hidden`}>
            <img
              src={message.attachment.src}
              alt={message.attachment.alt || ""}
              className="w-full max-w-[200px] h-auto rounded-xl"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
