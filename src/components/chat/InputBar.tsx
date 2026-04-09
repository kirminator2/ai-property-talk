import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, type CityKey } from '@/store/chatStore';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const CITY_SUGGESTIONS: Record<CityKey, { label: string; image: string }[]> = {
  moscow: [
    { label: 'Новостройки рядом с метро', image: property2 },
    { label: 'Пентхаусы в центре Москвы', image: property1 },
    { label: 'Двушки до 15 млн у метро', image: property3 },
    { label: 'Апартаменты с отделкой под ключ', image: property2 },
    { label: 'Квартиры в сданных новостройках', image: property1 },
    { label: 'Квартиры у парка с террасой', image: property3 },
    { label: 'Студии для инвестиций', image: property2 },
    { label: 'Лофты в историческом центре', image: property1 },
  ],
  spb: [
    { label: 'Студии на Васильевском', image: property3 },
    { label: 'Квартиры у Невского проспекта', image: property1 },
    { label: 'Новостройки в Приморском', image: property2 },
    { label: 'Видовые квартиры на набережной', image: property3 },
    { label: 'Инвестиционные студии', image: property1 },
    { label: 'Квартиры рядом с парками', image: property2 },
    { label: 'Апартаменты в Петроградском', image: property3 },
    { label: 'Двушки до 12 млн у метро', image: property1 },
  ],
  sochi: [
    { label: 'Квартиры с видом на море до 10 млн', image: property1 },
    { label: 'Апартаменты у пляжа', image: property2 },
    { label: 'Новостройки в Адлере', image: property3 },
    { label: 'Квартиры с террасой и видом', image: property1 },
    { label: 'Студии для сдачи в аренду', image: property2 },
    { label: 'Жильё рядом с Олимпийским парком', image: property3 },
    { label: 'Пентхаусы на первой линии', image: property1 },
    { label: 'Квартиры в горном кластере', image: property2 },
  ],
  kazan: [
    { label: 'Новостройки в центре Казани', image: property2 },
    { label: 'Квартиры у Кремля', image: property1 },
    { label: 'Студии для инвестиций', image: property3 },
    { label: 'Двушки до 8 млн', image: property2 },
    { label: 'Квартиры рядом с метро', image: property1 },
    { label: 'Жильё у озера Кабан', image: property3 },
    { label: 'Апартаменты с отделкой', image: property2 },
    { label: 'Новостройки сдача 2026', image: property1 },
  ],
  novosibirsk: [
    { label: 'Новостройки на левом берегу', image: property2 },
    { label: 'Квартиры в Академгородке', image: property3 },
    { label: 'Студии до 4 млн', image: property1 },
    { label: 'Двушки рядом с метро', image: property2 },
    { label: 'Квартиры у набережной Оби', image: property3 },
    { label: 'Новостройки бизнес-класса', image: property1 },
    { label: 'Апартаменты в центре', image: property2 },
    { label: 'Жильё рядом с парками', image: property3 },
  ],
};

const InputBar = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const simulateAIResponse = useChatStore((s) => s.simulateAIResponse);
  const isTyping = useChatStore((s) => s.isTyping);
  const messages = useChatStore((s) => s.messages);
  const selectedCity = useChatStore((s) => s.selectedCity);

  const isInitial = messages.length <= 1;
  const suggestions = CITY_SUGGESTIONS[selectedCity];

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    setInput('');
    simulateAIResponse(msg);
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
      layout="position"
      initial={false}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background px-3 shrink-0 py-3"
    >
      <div className="max-w-3xl mx-auto space-y-12 w-full">
        {/* Input field with snake border */}
        <div className="snake-border rounded-xl">
          <div className="flex items-end gap-2 bg-secondary rounded-xl px-3 py-2">
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
              onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-lg bg-foreground text-background disabled:opacity-40 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion cards - city-specific */}
        <AnimatePresence mode="wait">
          {isInitial && (
            <motion.div
              key={selectedCity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[40vh] sm:max-h-none overflow-y-auto sm:overflow-visible scrollbar-thin"
            >
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.label)}
                  className="rounded-xl border border-border bg-secondary hover:border-primary/40 hover:bg-secondary/80 transition-all overflow-hidden text-left group"
                >
                  <div className="h-28 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="px-2 py-1.5 text-xs text-muted-foreground leading-tight line-clamp-2">
                    {s.label}
                  </p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isInitial && (
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s.label}
                onClick={() => send(s.label)}
                className="shrink-0 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InputBar;
