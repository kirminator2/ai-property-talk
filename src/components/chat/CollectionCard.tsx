import { TrendingDown, TrendingUp, Minus, MapPin, Maximize2 } from 'lucide-react';
import type { Property } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const TrendBadge = ({ trend, percent }: { trend: Property['trend']; percent: number }) => {
  const config = {
    down: { icon: TrendingDown, cls: 'text-success bg-success/10' },
    up: { icon: TrendingUp, cls: 'text-destructive bg-destructive/10' },
    stable: { icon: Minus, cls: 'text-muted-foreground bg-muted' },
  }[trend];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.cls}`}>
      <Icon className="w-3 h-3" />
      {percent > 0 ? '+' : ''}{percent}%
    </span>
  );
};

const PriceScoreDot = ({ score }: { score: Property['priceScore'] }) => {
  const colors = { low: 'bg-success', fair: 'bg-warning', high: 'bg-destructive' };
  const labels = { low: 'Ниже рынка', fair: 'Рыночная', high: 'Выше рынка' };
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[score]}`} />
      {labels[score]}
    </span>
  );
};

interface Props {
  property: Property;
}

const CollectionCard = ({ property }: Props) => {
  const selectProperty = useChatStore((s) => s.selectProperty);

  return (
    <button
      onClick={() => selectProperty(property)}
      className="w-full max-w-sm bg-chat-card hover:bg-chat-card-hover border border-border rounded-xl overflow-hidden text-left transition-all duration-200 hover:border-primary/30 group"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={800}
          height={512}
        />
        <div className="absolute top-2 right-2">
          <TrendBadge trend={property.trend} percent={property.trendPercent} />
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="p-1.5 bg-background/80 backdrop-blur rounded-md inline-flex">
            <Maximize2 className="w-3.5 h-3.5 text-foreground" />
          </span>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground leading-tight">{property.title}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">{formatPrice(property.price)}</span>
          <PriceScoreDot score={property.priceScore} />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{property.area} м²</span>
          <span>{property.rooms} комн.</span>
          <span>{property.floor}/{property.totalFloors} эт.</span>
        </div>
      </div>
    </button>
  );
};

export default CollectionCard;
