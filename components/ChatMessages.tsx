import { Message } from "@/types";
import React from "react";

interface ChatMessagesProps {
  currentChat: { messages: Message[] } | null;
  loading: boolean;
  streamingContent: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ currentChat, loading, streamingContent, chatEndRef }) => (
  <div
    className="flex-1 overflow-y-auto custom-scrollbar w-full max-w-full px-2 sm:px-4 md:px-16 lg:px-24 py-4 md:py-8 flex flex-col gap-2"
    id="chat-scroll-area"
  >
    {loading && currentChat && currentChat.messages.length === 0 && (
      <span className="text-orange-500 dark:text-orange-400">Waiting for response...</span>
    )}
    {currentChat && currentChat.messages.length > 0 ? (
      <div className="flex flex-col gap-2 w-full">
        {currentChat.messages.map((msg, idx, arr) => (
          <div
            key={idx}
            className={`w-full max-w-full break-words whitespace-pre-wrap rounded-lg px-4 py-3 shadow-sm text-base ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 self-end' : 'bg-orange-100 dark:bg-blue-950 text-blue-900 dark:text-orange-100 self-start'}`}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            {msg.role === 'assistant' && idx === arr.length - 1 && streamingContent
              ? streamingContent
              : msg.content}
          </div>
        ))}
        {loading && streamingContent && (!currentChat.messages.length || currentChat.messages[currentChat.messages.length - 1].role !== 'assistant') && (
          <div className="w-full max-w-full break-words whitespace-pre-wrap rounded-lg px-4 py-3 shadow-sm bg-blue-950 text-orange-100 self-start text-base">
            {streamingContent}
          </div>
        )}
      </div>
    ) : (
      !loading && <span className="text-blue-400 dark:text-blue-200">AI response will appear here.</span>
    )}
    <div ref={chatEndRef} />
  </div>
);

export default ChatMessages;