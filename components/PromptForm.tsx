import React from "react";

interface PromptFormProps {
  prompt: string;
  setPrompt: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  model: string;
  setModel: (v: string) => void;
  MODELS: { label: string; value: string }[];
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, handleSubmit, loading, model, setModel, MODELS, textareaRef }) => (
  <form
    onSubmit={handleSubmit}
    className="w-full mx-auto bg-white/80 dark:bg-blue-950/80 rounded-t-xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row items-end gap-4 sticky bottom-0 z-10"
    style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}
  >
    <div className="flex-1 flex flex-col w-full">
      <textarea
        id="prompt"
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        className="w-full min-h-[48px] max-h-40 p-3 text-base rounded-lg border border-blue-200 dark:border-blue-800 focus:border-orange-400 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 font-sans resize-y text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900 break-words whitespace-pre-wrap"
        placeholder="Ask anything..."
        autoFocus
      />
    </div>
    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
      <div className="flex flex-col w-full md:w-auto">
        <label htmlFor="model" className="font-medium text-blue-900 dark:text-blue-100">Model:</label>
        <select
          id="model"
          value={model}
          onChange={e => setModel(e.target.value)}
          className="cursor-pointer text-base px-3 py-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 focus:border-orange-400 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        >
          {MODELS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className={`cursor-pointer bg-orange-400 dark:bg-orange-500 text-blue-900 dark:text-blue-950 font-bold rounded-lg px-6 py-2 text-base transition-opacity duration-200 ${loading || !prompt.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-orange-500 dark:hover:bg-orange-400'}`}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  </form>
);

export default PromptForm;