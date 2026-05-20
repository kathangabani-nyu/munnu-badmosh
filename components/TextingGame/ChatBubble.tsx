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
          max-w-[78%] px-3.5 py-2
          ${isUser
            ? "bg-[#0A84FF] text-white rounded-[1.1rem] rounded-br-sm"
            : "bg-[#E9E9EB] text-[#1D1D1F] rounded-[1.1rem] rounded-bl-sm"
          }
          text-[0.94rem] leading-[1.35] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]
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
