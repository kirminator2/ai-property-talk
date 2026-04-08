import { Menu, Bell, Sparkles, MapPin, ChevronDown, MessageSquare, LayoutGrid } from 'lucide-react';
import { useChatStore, type CityKey, type AppMode } from '@/store/chatStore';
import { useState, useRef, useEffect } from 'react';

const CITIES: { key: CityKey; label: string }[] = [
  { key: 'moscow', label: 'Москва' },
  { key: 'spb', label: 'Санкт-Петербург' },
  { key: 'sochi', label: 'Сочи' },
  { key: 'kazan', label: 'Казань' },
  { key: 'novosibirsk', label: 'Новосибирск' },
];

const Header = () => {
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const selectedCity = useChatStore((s) => s.selectedCity);
  const setCity = useChatStore((s) => s.setCity);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = CITIES.find((c) => c.key === selectedCity)!;

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

      <div className="flex items-center gap-3">
        {/* City selector */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 transition-colors text-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground font-medium truncate max-w-[80px] sm:max-w-none">{current.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-xl shadow-lg py-1 z-50">
              {CITIES.map((city) => (
                <button
                  key={city.key}
                  onClick={() => { setCity(city.key); setOpen(false); }}
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
