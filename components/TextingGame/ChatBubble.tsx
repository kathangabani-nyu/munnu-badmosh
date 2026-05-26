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
          max-w-[78%] px-3.5 py-2 shadow-[0_12px_28px_-22px_rgba(29,29,31,0.7)]
          ${isUser
            ? "bg-[linear-gradient(180deg,#26a0ff_0%,#0A84FF_100%)] text-white rounded-[1.1rem] rounded-br-sm"
            : "bg-white/82 text-[#1D1D1F] rounded-[1.1rem] rounded-bl-sm ring-1 ring-black/[0.04] backdrop-blur-xl"
          }
          text-[0.94rem] leading-[1.35] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]
        `}
      >
        {message.text && <p>{message.text}</p>}
        {message.attachment && (
          <div className={`${message.text ? "mt-2" : ""} overflow-hidden rounded-2xl ring-1 ring-black/10`}>
            <img
              src={message.attachment.src}
              alt={message.attachment.alt || ""}
              className="h-auto w-full max-w-[220px] rounded-2xl"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
