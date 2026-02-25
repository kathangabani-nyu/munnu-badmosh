export interface MemeAttachment {
  type: "meme";
  src: string;
  alt?: string;
}

export interface ConversationMessage {
  id: string;
  sender: "them" | "user";
  text?: string;
  attachment?: MemeAttachment;
  delay?: number;
  typingDuration?: number;
}

export interface UserChoice {
  id: string;
  text: string;
  nextNodeId: string;
}

export interface ConversationNode {
  id: string;
  messages: ConversationMessage[];
  choices?: UserChoice[];
  isEnding?: boolean;
}

export interface ConversationData {
  startNodeId: string;
  nodes: Record<string, ConversationNode>;
}

export type GamePhase = "playing" | "transitioning" | "archive";

export interface ChatMessage {
  id: string;
  sender: "them" | "user";
  text?: string;
  attachment?: MemeAttachment;
  timestamp: number;
}
