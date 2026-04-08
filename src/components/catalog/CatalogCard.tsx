import { TrendingDown, TrendingUp, Minus, MapPin } from 'lucide-react';
import type { Property } from '@/types/chat';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const CatalogCard = ({ property: p, onClick }: { property: Property; onClick: () => void }) => {
  const TrendIcon = p.trend === 'down' ? TrendingDown : p.trend === 'up' ? TrendingUp : Minus;
  const trendColor = p.trend === 'down' ? 'text-success' : p.trend === 'up' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-3 rounded-xl border border-border hover:border-primary/30 bg-card hover:bg-accent/30 transition-all text-left group"
    >
      <img src={p.image} alt={p.title} className="w-28 h-20 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {p.title}
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{p.address}</p>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-primary">{formatPrice(p.price)}</span>
          <span className="flex items-center gap-0.5">
            <TrendIcon className={`w-3 h-3 ${trendColor}`} />
            <span className={`text-xs ${trendColor}`}>{p.trendPercent > 0 ? '+' : ''}{p.trendPercent}%</span>
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{p.area} м²</span>
          <span>{p.rooms} комн.</span>
          <span>{p.floor}/{p.totalFloors} эт.</span>
          <span>{formatPrice(p.pricePerSqm)}/м²</span>
        </div>
      </div>
    </button>
  );
};

export default CatalogCard;
