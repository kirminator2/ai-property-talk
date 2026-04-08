import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Eye, TrendingDown, TrendingUp, Minus, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useState } from 'react';
import type { Property } from '@/types/chat';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const TrendIcon = ({ trend }: { trend: Property['trend'] }) => {
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-success" />;
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const formatShortPrice = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}К`;
  return String(n);
};

const PriceChart = ({ history }: { history: Property['priceHistory'] }) => {
  const data = history.map((h) => ({ date: h.date.slice(5), price: h.price }));

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={formatShortPrice} width={45} domain={['dataMin - 100000', 'dataMax + 100000']} />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            formatter={(value: number) => [formatPrice(value), 'Цена']}
          />
          <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#priceGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const hasPriceChanges = (history: Property['priceHistory']) => {
  if (history.length < 2) return false;
  return history.some((h, i) => i > 0 && h.price !== history[i - 1].price);
};

const RightPanel = () => {
  const { selectedProperty: property, isPanelOpen, closePanel } = useChatStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  if (!property) return null;

  const imgs = property.images;
  const priceHasChanges = hasPriceChanges(property.priceHistory);

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
                <div className="relative">
                  <h2 className="text-lg font-bold text-foreground mb-1">{property.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{property.address}</p>
                  <button
                    onClick={() => priceHasChanges && setShowPriceHistory((v) => !v)}
                    className={`flex items-center gap-3 ${priceHasChanges ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                  >
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendIcon trend={property.trend} />
                      <span className="text-sm text-muted-foreground">{property.trendPercent > 0 ? '+' : ''}{property.trendPercent}%</span>
                    </span>
                    {priceHasChanges && (
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showPriceHistory ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">{formatPrice(property.pricePerSqm)} / м²</p>

                  {/* Price history - overlay dropdown */}
                  <AnimatePresence>
                    {showPriceHistory && priceHasChanges && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 z-10 bg-panel border border-border rounded-xl p-4 shadow-lg"
                      >
                        <h3 className="text-sm font-semibold text-foreground mb-3">История цены</h3>
                        <PriceChart history={property.priceHistory} />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              </div>
            </div>

            {/* Sticky bottom actions */}
            <div className="shrink-0 border-t border-border p-4 space-y-2 bg-panel">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
