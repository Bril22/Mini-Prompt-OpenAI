import React from "react";
import HistoryCard from "./HistoryCard";
import { ChatHistoryItem } from "@/types";

interface SideBarProps {
  showHistory: boolean;
  setShowHistory: (v: boolean) => void;
  history: ChatHistoryItem[];
  currentChat: ChatHistoryItem | null;
  handleHistoryClick: (item: ChatHistoryItem) => void;
  handleDeleteHistory: (id: string) => void;
  startNewChat: () => void;
  MODELS: { label: string; value: string }[];
}

const SideBar: React.FC<SideBarProps> = ({ showHistory, setShowHistory, history, currentChat, handleHistoryClick, handleDeleteHistory, startNewChat, MODELS }) => (
  <div className={`transition-all duration-200 shadow-lg flex flex-col ${showHistory ? 'w-72 md:w-80' : 'w-44'} bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white h-screen max-h-screen`}>
    <div className="flex w-full justify-between items-center p-4 font-bold">
      <div>{`Prompt Testing`}</div>
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="self-end cursor-pointer text-xl w-8 focus:outline-none hover:text-orange-500 dark:hover:text-orange-400"
        aria-label={showHistory ? "Hide history" : "Show history"}
      >
        {showHistory ? "⟨" : "⟩"}
      </button>
    </div>
    {showHistory && (
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 custom-scrollbar">
        <div className="p-4">
          <h3 className="mt-0 mb-4 text-lg font-bold text-orange-500 dark:text-orange-400">History</h3>
          {history.length === 0 && <div className="text-blue-400 dark:text-blue-200">No history yet.</div>}
        </div>
        <ul className="list-none p-0 m-0 flex-1 overflow-y-auto px-4">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              isActive={currentChat?.id === item.id}
              onClick={() => handleHistoryClick(item)}
              onDelete={() => handleDeleteHistory(item.id)}
              MODELS={MODELS}
            />
          ))}
        </ul>
      </div>
    )}
    <button
      type="button"
      onClick={startNewChat}
      className={`${showHistory ? 'px-4 py-2 bg-blue-200 dark:bg-blue-900' : 'py-2 px-4'} text-base cursor-pointer m-4 text-orange-600 dark:text-orange-400 font-bold rounded-lg hover:bg-blue-300 dark:hover:bg-blue-800 transition-colors`}
    >
      {`+ New Chat`}
    </button>
  </div>
);

export default SideBar;