"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_-10%,rgba(10,132,255,0.18),transparent_34%),linear-gradient(180deg,#fbfbfd_0%,#f1f2f7_55%,#e9ecf4_100%)] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.9),transparent_24%),radial-gradient(circle_at_82%_80%,rgba(10,132,255,0.12),transparent_28%)]" />

      <div className="relative border-b border-white/60 bg-white/72 px-5 py-3 pt-[env(safe-area-inset-top)] text-center shadow-[0_12px_36px_-28px_rgba(29,29,31,0.55)] backdrop-blur-2xl">
        <p className="text-[0.82rem] font-semibold text-[#1D1D1F] drop-shadow-sm">
          munna <span aria-hidden>💀</span>
        </p>
        <p className="text-[0.68rem] text-[#8E8E93] mt-0.5">iMessage (fake)</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onComplete}
          className="absolute right-3 top-1/2 h-8 -translate-y-1/2 gap-0.5 px-2 text-[0.75rem] text-[#6b6b70] hover:bg-black/5 hover:text-[#1D1D1F]"
        >
          skip <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto px-3 py-4"
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
