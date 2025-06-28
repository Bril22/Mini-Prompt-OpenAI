'use client'
import ChatMessages from "@/components/ChatMessages";
import PromptForm from "@/components/PromptForm";
import SideBar from "@/components/SideBar";
import { MODELS, HISTORY_KEY, MAX_HISTORY } from "@/constants";
import { usePromptApi } from "@/hooks/usePromptApi";
import { ChatHistoryItem, Message } from "@/types";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [currentChat, setCurrentChat] = useState<ChatHistoryItem | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].value);
  const [showHistory, setShowHistory] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { fetchPrompt } = usePromptApi();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    if (currentChat && currentChat.id === id) {
      setCurrentChat(null);
    }
  };

  const startNewChat = () => {
    setCurrentChat({
      id: Date.now().toString(),
      messages: [],
      timestamp: Date.now(),
      model,
    });
    setPrompt("");
    setModel(MODELS[0].value);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setStreamingContent("");
    const userMessage: Message = { role: 'user', content: prompt };
    let chat = currentChat;
    if (!chat) {
      chat = {
        id: Date.now().toString(),
        messages: [],
        timestamp: Date.now(),
        model,
      };
    }
    const updatedMessages = [...chat.messages, userMessage];
    setCurrentChat({ ...chat, messages: updatedMessages });
    setPrompt("");
    try {
      const res = await fetchPrompt(updatedMessages, model);
      if (res.body) {
        const reader = res.body.getReader();
        let aiContent = "";
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = new TextDecoder().decode(value);
            aiContent += chunk;
            setStreamingContent(aiContent);
            setCurrentChat(prev => prev ? {
              ...prev,
              messages: [
                ...updatedMessages,
                { role: 'assistant', content: aiContent }
              ]
            } : null);
          }
        }
        const newChat: ChatHistoryItem = {
          ...chat,
          messages: [...updatedMessages, { role: 'assistant', content: aiContent }],
          timestamp: Date.now(),
          model,
        };
        let newHistory = history.filter(h => h.id !== newChat.id);
        newHistory = [newChat, ...newHistory].slice(0, MAX_HISTORY);
        setHistory(newHistory);
      } else {
        throw new Error("No response body");
      }
    } catch (err: any) {
      setError(err?.message || "Error: Could not get response.");
      const aiMessage: Message = { role: 'assistant', content: "Error: Could not get response." };
      const newChat: ChatHistoryItem = {
        ...chat,
        messages: [...updatedMessages, aiMessage],
        timestamp: Date.now(),
        model,
      };
      setCurrentChat(newChat);
      let newHistory = history.filter(h => h.id !== newChat.id);
      newHistory = [newChat, ...newHistory].slice(0, MAX_HISTORY);
      setHistory(newHistory);
    } finally {
      setLoading(false);
      setStreamingContent("");
    }
  };

  const handleHistoryClick = (item: ChatHistoryItem) => {
    setCurrentChat(item);
    setModel(item.model);
    setPrompt("");
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages.length, streamingContent]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-100 dark:from-blue-950 dark:via-blue-900 dark:to-orange-900 transition-colors duration-300 relative">
      <SideBar
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        history={history}
        currentChat={currentChat}
        handleHistoryClick={handleHistoryClick}
        handleDeleteHistory={handleDeleteHistory}
        startNewChat={startNewChat}
        MODELS={MODELS}
      />
      <div className="flex-1 flex flex-col h-screen max-h-screen">
        {error && (
          <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-2 rounded mb-2 text-sm font-semibold">
            {error}
          </div>
        )}
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
          loading={loading}
          model={model}
          setModel={setModel}
          MODELS={MODELS}
          textareaRef={textareaRef}
        />
        <ChatMessages
          currentChat={currentChat}
          loading={loading}
          streamingContent={streamingContent}
          chatEndRef={chatEndRef}
        />
      </div>
    </div>
  );
}
