export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatHistoryItem {
    id: string;
    messages: Message[];
    timestamp: number;
    model: string;
}
