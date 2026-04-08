import { MapPin } from 'lucide-react';
import type { Property } from '@/types/chat';

const CatalogMap = ({ properties }: { properties: Property[] }) => {
  return (
    <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
      {/* Placeholder grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Fake map pins */}
      <div className="absolute inset-0">
        {properties.slice(0, 5).map((p, i) => {
          const positions = [
            { top: '30%', left: '40%' },
            { top: '50%', left: '60%' },
            { top: '25%', left: '70%' },
            { top: '65%', left: '35%' },
            { top: '45%', left: '50%' },
          ];
          const pos = positions[i % positions.length];
          return (
            <div
              key={p.id}
              className="absolute flex flex-col items-center animate-in fade-in duration-500"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                {(p.price / 1_000_000).toFixed(1)}М ₽
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary" />
            </div>
          );
        })}
      </div>

      {/* Overlay message */}
      <div className="relative z-10 flex flex-col items-center gap-2 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">Яндекс Карты</p>
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Для отображения карты необходим API-ключ Яндекс Карт
        </p>
      </div>
    </div>
  );
};

export default CatalogMap;
