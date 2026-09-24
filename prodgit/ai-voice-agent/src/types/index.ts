export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  tokensUsed?: number;
  audioUrl?: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface VoiceSettings {
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  speed: number;
  pitch: number;
  autoPlay: boolean;
}
