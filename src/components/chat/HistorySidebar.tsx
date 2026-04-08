import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, PinOff, MessageSquare, Plus, MapPin, Bell, ChevronDown } from 'lucide-react';
import { useChatStore, type CityKey } from '@/store/chatStore';
import { useState } from 'react';

const CITIES: { key: CityKey; label: string }[] = [
  { key: 'moscow', label: 'Москва' },
  { key: 'spb', label: 'Санкт-Петербург' },
  { key: 'sochi', label: 'Сочи' },
  { key: 'kazan', label: 'Казань' },
  { key: 'novosibirsk', label: 'Новосибирск' },
];

const HistorySidebar = () => {
  const { isSidebarOpen, isSidebarPinned, setSidebarOpen, toggleSidebarPin, projects } = useChatStore();

  if (!isSidebarOpen) return null;

  // Pinned: render static sidebar (no animation overlay) — desktop only
  if (isSidebarPinned) {
    return (
      <aside className="hidden lg:flex w-72 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <SidebarContent
          isPinned={isSidebarPinned}
          onClose={() => { toggleSidebarPin(); setSidebarOpen(false); }}
          onTogglePin={toggleSidebarPin}
          projects={projects}
          isMobile={false}
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
              isMobile={true}
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
  isMobile: boolean;
}

const SidebarContent = ({ isPinned, onClose, onTogglePin, projects, isMobile }: SidebarContentProps) => {
  const selectedCity = useChatStore((s) => s.selectedCity);
  const setCity = useChatStore((s) => s.setCity);
  const [cityOpen, setCityOpen] = useState(false);

  const currentCity = CITIES.find((c) => c.key === selectedCity)!;

  return (
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

      {/* Mobile-only bottom section: city, status, notifications */}
      {isMobile && (
        <div className="border-t border-sidebar-border p-3 space-y-2 sm:hidden">
          {/* City selector */}
          <div className="relative">
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sm"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium flex-1 text-left">{currentCity.label}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
            </button>
            {cityOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-xl shadow-lg py-1 z-50">
                {CITIES.map((city) => (
                  <button
                    key={city.key}
                    onClick={() => { setCity(city.key); setCityOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      city.key === selectedCity
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-success font-medium">Онлайн</span>
          </div>

          {/* Notifications */}
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sm hover:bg-accent transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium flex-1 text-left">Уведомления</span>
            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">2</span>
          </button>
        </div>
      )}
    </>
  );
};

export default HistorySidebar;
