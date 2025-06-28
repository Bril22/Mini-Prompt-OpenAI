import React from "react";
import DeleteSVG from "./Icons";
import { ChatHistoryItem } from "@/types";

interface HistoryCardProps {
  item: ChatHistoryItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  MODELS: { label: string; value: string }[];
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, isActive, onClick, onDelete, MODELS }) => (
  <li
    className={`group relative mb-4 bg-blue-200 dark:bg-blue-800 rounded-lg p-3 cursor-pointer transition-colors ${isActive
      ? 'bg-orange-200 dark:bg-orange-400 text-blue-900 dark:text-blue-950'
      : 'hover:bg-orange-200 dark:hover:bg-orange-400 hover:text-blue-900 dark:hover:text-blue-950'}`}
    onClick={onClick}
    title={new Date(item.timestamp).toLocaleString()}
  >
    <button
      type="button"
      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1 cursor-pointer hover:bg-white hover:text-red-900"
      onClick={e => { e.stopPropagation(); onDelete(); }}
      aria-label="Delete history"
    >
      <DeleteSVG />
    </button>
    <div className="font-semibold text-sm mb-1 break-words">
      {item.messages[0]?.content || "(no prompt)"}
    </div>
    <div className="text-xs group-hover:text-white text-blue-500 dark:text-blue-200 break-words whitespace-pre-line max-h-16 overflow-hidden">
      {item.messages.filter(m => m.role === 'assistant').map(m => m.content).join("\n")}
    </div>
    <div className="text-xs group-hover:text-white text-orange-600 dark:text-orange-300 mt-1">
      {MODELS.find(m => m.value === item.model)?.label || item.model}
    </div>
    <div className="text-[10px] group-hover:text-white text-blue-400 dark:text-blue-300 mt-1">
      {new Date(item.timestamp).toLocaleString()}
    </div>
  </li>
);

export default HistoryCard;