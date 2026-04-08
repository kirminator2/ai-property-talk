import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { MOCK_PROPERTIES } from '@/store/chatStore';
import { useChatStore } from '@/store/chatStore';
import CatalogCard from './CatalogCard';
import CatalogMap from './CatalogMap';
import type { Property } from '@/types/chat';

type SortKey = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'pricePerSqm-asc' | 'pricePerSqm-desc';
type ViewMode = 'list' | 'map' | 'split';

const ROOM_OPTIONS = [1, 2, 3, 4];

const CatalogView = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('price-asc');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showFilters, setShowFilters] = useState(false);
  const selectProperty = useChatStore((s) => s.selectProperty);

  const toggleRoom = (r: number) =>
    setSelectedRooms((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const filtered = useMemo(() => {
    let items = [...MOCK_PROPERTIES];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
      );
    }

    if (selectedRooms.length > 0) {
      items = items.filter((p) => selectedRooms.includes(p.rooms));
    }

    if (priceMin) items = items.filter((p) => p.price >= Number(priceMin));
    if (priceMax) items = items.filter((p) => p.price <= Number(priceMax));

    const [key, dir] = sort.split('-') as [keyof Property, string];
    items.sort((a, b) => {
      const av = a[key] as number;
      const bv = b[key] as number;
      return dir === 'asc' ? av - bv : bv - av;
    });

    return items;
  }, [search, sort, selectedRooms, priceMin, priceMax]);

  const activeFiltersCount = selectedRooms.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  const clearFilters = () => {
    setSelectedRooms([]);
    setPriceMin('');
    setPriceMax('');
    setSearch('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search & filter bar */}
      <div className="shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по адресу, названию..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`p-2 rounded-xl border transition-colors relative ${
              showFilters ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View mode toggle */}
          <div className="hidden md:flex items-center border border-border rounded-xl overflow-hidden">
            {(['list', 'split', 'map'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'list' ? 'Список' : mode === 'map' ? 'Карта' : 'Сплит'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Rooms */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Комнат:</span>
              {ROOM_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRoom(r)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    selectedRooms.includes(r)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-accent'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Price range */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Цена:</span>
              <input
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value.replace(/\D/g, ''))}
                placeholder="от"
                className="w-24 px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <input
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ''))}
                placeholder="до"
                className="w-24 px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="area-asc">Площадь ↑</option>
              <option value="area-desc">Площадь ↓</option>
              <option value="pricePerSqm-asc">Цена/м² ↑</option>
              <option value="pricePerSqm-desc">Цена/м² ↓</option>
            </select>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> Сбросить
              </button>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Найдено: {filtered.length} объектов
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Property list */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={`overflow-y-auto p-4 space-y-3 ${viewMode === 'split' ? 'w-1/2 border-r border-border' : 'w-full'}`}>
            {filtered.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-sm">Ничего не найдено</p>
                <p className="text-xs mt-1">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              filtered.map((p) => (
                <CatalogCard key={p.id} property={p} onClick={() => selectProperty(p)} />
              ))
            )}
          </div>
        )}

        {/* Map */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'w-1/2' : 'w-full'}>
            <CatalogMap properties={filtered} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogView;
