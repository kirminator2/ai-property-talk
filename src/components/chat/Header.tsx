import { Menu, Bell, Sparkles } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

const Header = () => {
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border glass shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground text-lg hidden sm:inline">EstateAI</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
          <span className="text-success font-medium hidden sm:inline">Онлайн</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;
