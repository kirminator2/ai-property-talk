import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, PinOff, MessageSquare, Plus } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

const HistorySidebar = () => {
  const { isSidebarOpen, isSidebarPinned, setSidebarOpen, toggleSidebarPin, projects } = useChatStore();

  if (!isSidebarOpen) return null;

  // Pinned: render static sidebar (no animation overlay)
  if (isSidebarPinned) {
    return (
      <aside className="hidden md:flex w-72 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <SidebarContent
          isPinned={isSidebarPinned}
          onClose={() => { toggleSidebarPin(); setSidebarOpen(false); }}
          onTogglePin={toggleSidebarPin}
          projects={projects}
        />
      </aside>
    );
  }

  // Unpinned: floating overlay with animation
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
          >
            <SidebarContent
              isPinned={isSidebarPinned}
              onClose={() => setSidebarOpen(false)}
              onTogglePin={toggleSidebarPin}
              projects={projects}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

interface SidebarContentProps {
  isPinned: boolean;
  onClose: () => void;
  onTogglePin: () => void;
  projects: { id: string; title: string; lastMessage: string; pinned: boolean }[];
}

const SidebarContent = ({ isPinned, onClose, onTogglePin, projects }: SidebarContentProps) => (
  <>
    <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
      <span className="font-semibold text-foreground">История</span>
      <div className="flex items-center gap-1">
        <button
          onClick={onTogglePin}
          className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'bg-primary/15 text-primary' : 'hover:bg-sidebar-accent text-muted-foreground'}`}
          title={isPinned ? 'Открепить панель' : 'Закрепить панель'}
        >
          {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </button>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>

    <div className="p-3">
      <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
        <Plus className="w-4 h-4" />
        Новый диалог
      </button>
    </div>

    <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-1">
      {projects.map((p) => (
        <button
          key={p.id}
          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors group"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">{p.title}</span>
            {p.pinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground truncate pl-5.5">{p.lastMessage}</p>
        </button>
      ))}
    </div>
  </>
);

export default HistorySidebar;
