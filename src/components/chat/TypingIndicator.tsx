import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex gap-2.5"
  >
    <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
      <Bot className="w-3.5 h-3.5 text-accent-foreground" />
    </div>
    <div className="px-4 py-3 bg-chat-ai rounded-2xl rounded-tl-md flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </motion.div>
);

export default TypingIndicator;
