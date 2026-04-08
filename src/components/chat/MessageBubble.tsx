import { motion } from 'framer-motion';
import type { ChatMessage } from '@/types/chat';
import CollectionCard from './CollectionCard';
import { Bot, User } from 'lucide-react';

const renderMarkdownLite = (text: string) => {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : <span key={i}>{part}</span>
  );
};

interface Props {
  message: ChatMessage;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? 'bg-primary/20' : 'bg-accent'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-primary" /> : <Bot className="w-3.5 h-3.5 text-accent-foreground" />}
      </div>
      <div className={`max-w-[85%] md:max-w-[70%] space-y-3`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-chat-user text-foreground rounded-tr-md'
            : 'bg-chat-ai text-foreground rounded-tl-md'
        }`}>
          {renderMarkdownLite(message.content)}
        </div>
        {message.properties && message.properties.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {message.properties.map((p) => (
              <CollectionCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
