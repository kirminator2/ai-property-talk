import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, MessageSquare, Plus } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

const HistorySidebar = () => {
  const { isSidebarOpen, setSidebarOpen, projects } = useChatStore();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
          >
            <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
              <span className="font-semibold text-foreground">История</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistorySidebar;
