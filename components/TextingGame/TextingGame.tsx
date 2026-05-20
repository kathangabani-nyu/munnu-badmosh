"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChoiceButtons } from "./ChoiceButtons";
import { conversationData } from "./conversationData";
import type { ChatMessage, UserChoice, ConversationMessage } from "./types";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TextingGameProps {
  onComplete: () => void;
}

export function TextingGame({ onComplete }: TextingGameProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<UserChoice[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentChoices, scrollToBottom]);

  const playMessages = useCallback(async (nodeMessages: ConversationMessage[]) => {
    for (const msg of nodeMessages) {
      if (msg.sender === "them") {
        await sleep(msg.delay || 500);
        setIsTyping(true);
        await sleep(msg.typingDuration || 1000);
        setIsTyping(false);
      }

      const chatMsg: ChatMessage = {
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        attachment: msg.attachment,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, chatMsg]);
    }
  }, []);

  // Start conversation on mount
  useEffect(() => {
    const startNode = conversationData.nodes[conversationData.startNodeId];
    if (startNode) {
      playMessages(startNode.messages).then(() => {
        if (startNode.choices) {
          setCurrentChoices(startNode.choices);
        }
        if (startNode.isEnding) {
          setTimeout(onComplete, 2000);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = useCallback(
    async (choice: UserChoice) => {
      setIsProcessing(true);
      setCurrentChoices(null);

      // Add user's message
      const userMsg: ChatMessage = {
        id: `user-${choice.id}`,
        sender: "user",
        text: choice.text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      await sleep(600);

      // Play next node
      const nextNode = conversationData.nodes[choice.nextNodeId];
      if (nextNode) {
        await playMessages(nextNode.messages);

        if (nextNode.isEnding) {
          await sleep(1500);
          onComplete();
        } else if (nextNode.choices) {
          setCurrentChoices(nextNode.choices);
        }
      }

      setIsProcessing(false);
    },
    [onComplete, playMessages]
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-[#F2F2F7] z-40 flex flex-col font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]"
    >
      {/* Header */}
      <div className="pt-[env(safe-area-inset-top)] px-5 py-3 text-center border-b border-[#D1D1D6] relative bg-white/85 backdrop-blur-md">
        <p className="text-[0.82rem] font-semibold text-[#1D1D1F]">
          munna <span aria-hidden>💀</span>
        </p>
        <p className="text-[0.68rem] text-[#8E8E93] mt-0.5">iMessage (fake)</p>
        <button
          onClick={onComplete}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.75rem] text-[#8E8E93] hover:text-[#636366] transition-colors cursor-pointer"
        >
          skip &rsaquo;
        </button>
      </div>

      {/* Chat area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-3 py-3"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <AnimatePresence>
          {currentChoices && (
            <ChoiceButtons
              choices={currentChoices}
              onChoose={handleChoice}
              disabled={isProcessing}
            />
          )}
        </AnimatePresence>

        <div ref={messageEndRef} className="h-4" />
      </div>
    </motion.div>
  );
}
