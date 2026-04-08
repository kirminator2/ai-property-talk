import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Eye, TrendingDown, TrendingUp, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useState } from 'react';
import type { Property } from '@/types/chat';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const TrendIcon = ({ trend }: { trend: Property['trend'] }) => {
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-success" />;
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const PriceChart = ({ history }: { history: Property['priceHistory'] }) => {
  const prices = history.map((h) => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  return (
    <div className="h-20 flex items-end gap-1">
      {history.map((h, i) => {
        const height = ((h.price - min) / range) * 60 + 20;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-primary/30 hover:bg-primary/50 transition-colors"
              style={{ height: `${height}%` }}
            />
            <span className="text-[10px] text-muted-foreground">{h.date.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
};

const RightPanel = () => {
  const { selectedProperty: property, isPanelOpen, closePanel } = useChatStore();
  const [imgIdx, setImgIdx] = useState(0);

  if (!property) return null;

  const imgs = property.images;

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30 md:hidden"
            onClick={closePanel}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-panel border-l border-border z-40 flex flex-col"
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
              <span className="font-semibold text-foreground text-sm">Детали объекта</span>
              <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* Gallery */}
              <div className="relative h-56 bg-muted">
                <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
                {imgs.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur hover:bg-background/90 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % imgs.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur hover:bg-background/90 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {imgs.map((_, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-primary' : 'bg-foreground/30'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 space-y-5">
                {/* Title & price */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">{property.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{property.address}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={property.trend} />
                      <span className="text-sm text-muted-foreground">{property.trendPercent > 0 ? '+' : ''}{property.trendPercent}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatPrice(property.pricePerSqm)} / м²</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Площадь', value: `${property.area} м²` },
                    { label: 'Комнат', value: `${property.rooms}` },
                    { label: 'Этаж', value: `${property.floor}/${property.totalFloors}` },
                  ].map((s) => (
                    <div key={s.label} className="bg-secondary rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Price history */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">История цены</h3>
                  <PriceChart history={property.priceHistory} />
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Описание</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Особенности</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <span key={f} className="px-2.5 py-1 rounded-full bg-accent text-xs text-accent-foreground">{f}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pb-4">
                  <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Добавить в отслеживание
                  </button>
                  <a
                    href={property.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Открыть на {property.source}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
