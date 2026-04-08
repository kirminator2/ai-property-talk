import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const SUGGESTIONS = [
  { label: 'Квартиры с видом на море до 10 млн', image: property1 },
  { label: 'Новостройки рядом с метро', image: property2 },
  { label: 'Студии для инвестиций в СПб', image: property3 },
];

const InputBar = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const simulateAIResponse = useChatStore((s) => s.simulateAIResponse);
  const isTyping = useChatStore((s) => s.isTyping);
  const messages = useChatStore((s) => s.messages);

  const isInitial = messages.length <= 1;

  const send = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    simulateAIResponse(text);
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`border-t border-border bg-background px-3 shrink-0 ${
        isInitial ? 'flex-1 flex items-center' : 'py-3'
      }`}
    >
      <div className="max-w-3xl mx-auto space-y-3 w-full">
        {/* Suggestion cards */}
        <AnimatePresence>
          {isInitial && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 overflow-x-auto scrollbar-thin pb-1"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setInput(s.label); inputRef.current?.focus(); }}
                  className="shrink-0 w-44 rounded-xl border border-border bg-secondary hover:border-primary/40 hover:bg-secondary/80 transition-all overflow-hidden text-left group"
                >
                  <div className="h-20 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="px-2.5 py-2 text-xs text-muted-foreground leading-tight line-clamp-2">
                    {s.label}
                  </p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact pill suggestions when not initial */}
        {!isInitial && (
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => { setInput(s.label); inputRef.current?.focus(); }}
                className="shrink-0 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input field */}
        <div className="flex items-end gap-2 bg-secondary rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Опишите, что вы ищете..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-[120px]"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InputBar;
