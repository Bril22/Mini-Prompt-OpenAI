import { useCallback } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const usePromptApi = () => {
  const fetchPrompt = useCallback(async (messages: Message[], model: string) => {
    const res = await fetch("/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model }),
    });
    return res;
  }, []);

  return { fetchPrompt };
};