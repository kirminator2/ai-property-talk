import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const initWelcome = useChatStore((s) => s.initWelcome);
  const endRef = useRef<HTMLDivElement>(null);
  const isInitial = messages.length <= 1 && !isTyping;

  useEffect(() => {
    initWelcome();
  }, [initWelcome]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={`md:overflow-y-auto scrollbar-thin ${isInitial ? 'shrink-0' : 'flex-1'}`}>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
