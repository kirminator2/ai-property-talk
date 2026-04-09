import { create } from 'zustand';
import type { ChatMessage, ChatProject, Property } from '@/types/chat';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: '3-комн. квартира с видом на море',
    address: 'Сочи, ул. Приморская, 42',
    price: 8500000,
    pricePerSqm: 121428,
    area: 70,
    rooms: 3,
    floor: 12,
    totalFloors: 18,
    image: property1,
    images: [property1, property2, property3],
    priceHistory: [
      { date: '2025-10', price: 9200000 },
      { date: '2025-12', price: 8900000 },
      { date: '2026-02', price: 8700000 },
      { date: '2026-04', price: 8500000 },
    ],
    priceScore: 'low',
    trend: 'down',
    trendPercent: -7.6,
    description: 'Просторная квартира с панорамным видом на Чёрное море. Свежий ремонт, высокие потолки, два балкона. Закрытая территория с парковкой.',
    features: ['Панорамный вид', 'Свежий ремонт', 'Закрытая территория', 'Паркинг', '2 балкона'],
    source: 'ЦИАН',
    sourceUrl: '#',
    addedDate: '2026-04-05',
    lat: 43.5855,
    lng: 39.7231,
  },
  {
    id: '2',
    title: '2-комн. квартира в новостройке',
    address: 'Москва, ЖК «Символ», корп. 8',
    price: 14200000,
    pricePerSqm: 236666,
    area: 60,
    rooms: 2,
    floor: 8,
    totalFloors: 25,
    image: property2,
    images: [property2, property1, property3],
    priceHistory: [
      { date: '2025-10', price: 13500000 },
      { date: '2025-12', price: 13800000 },
      { date: '2026-02', price: 14000000 },
      { date: '2026-04', price: 14200000 },
    ],
    priceScore: 'fair',
    trend: 'up',
    trendPercent: 5.2,
    description: 'Новостройка бизнес-класса рядом с метро «Авиамоторная». Сдача — 2027. Отделка white box, потолки 3.1м.',
    features: ['Метро 5 мин', 'White box', 'Потолки 3.1м', 'Подземный паркинг'],
    source: 'Яндекс.Недвижимость',
    sourceUrl: '#',
    addedDate: '2026-04-07',
    lat: 55.7558,
    lng: 37.6173,
  },
  {
    id: '3',
    title: 'Студия с ремонтом',
    address: 'Санкт-Петербург, Васильевский остров',
    price: 5900000,
    pricePerSqm: 168571,
    area: 35,
    rooms: 1,
    floor: 5,
    totalFloors: 12,
    image: property3,
    images: [property3, property1, property2],
    priceHistory: [
      { date: '2025-10', price: 5800000 },
      { date: '2025-12', price: 5850000 },
      { date: '2026-02', price: 5900000 },
      { date: '2026-04', price: 5900000 },
    ],
    priceScore: 'fair',
    trend: 'stable',
    trendPercent: 0.8,
    description: 'Уютная студия с дизайнерским ремонтом. Рядом набережная, парки, транспорт. Идеально для инвестиций.',
    features: ['Дизайнерский ремонт', 'У набережной', 'Мебель включена', 'Инвестиционная'],
    source: 'Авито',
    sourceUrl: '#',
    addedDate: '2026-04-06',
    lat: 59.9343,
    lng: 30.3351,
  },
  {
    id: '4',
    title: '4-комн. квартира в центре',
    address: 'Казань, ул. Баумана, 15',
    price: 12800000,
    pricePerSqm: 142222,
    area: 90,
    rooms: 4,
    floor: 6,
    totalFloors: 14,
    image: property1,
    images: [property1, property3, property2],
    priceHistory: [
      { date: '2025-10', price: 12000000 },
      { date: '2025-12', price: 12300000 },
      { date: '2026-02', price: 12600000 },
      { date: '2026-04', price: 12800000 },
    ],
    priceScore: 'fair',
    trend: 'up',
    trendPercent: 6.7,
    description: 'Просторная квартира в историческом центре Казани. Рядом Кремль, парки, рестораны.',
    features: ['Исторический центр', 'Рядом Кремль', 'Высокие потолки', 'Парковка во дворе'],
    source: 'ЦИАН',
    sourceUrl: '#',
    addedDate: '2026-04-04',
    lat: 55.7963,
    lng: 49.1088,
  },
  {
    id: '5',
    title: '1-комн. квартира у метро',
    address: 'Новосибирск, ул. Ленина, 78',
    price: 4200000,
    pricePerSqm: 105000,
    area: 40,
    rooms: 1,
    floor: 3,
    totalFloors: 9,
    image: property2,
    images: [property2, property3, property1],
    priceHistory: [
      { date: '2025-10', price: 4100000 },
      { date: '2025-12', price: 4150000 },
      { date: '2026-02', price: 4200000 },
      { date: '2026-04', price: 4200000 },
    ],
    priceScore: 'low',
    trend: 'stable',
    trendPercent: 1.2,
    description: 'Квартира с ремонтом рядом с метро. Тихий двор, хорошая инфраструктура.',
    features: ['Метро 3 мин', 'Тихий двор', 'Свежий ремонт', 'Мебель'],
    source: 'Авито',
    sourceUrl: '#',
    addedDate: '2026-04-03',
    lat: 55.0302,
    lng: 82.9204,
  },
  {
    id: '6',
    title: '2-комн. квартира с террасой',
    address: 'Сочи, ул. Навагинская, 12',
    price: 11500000,
    pricePerSqm: 191666,
    area: 60,
    rooms: 2,
    floor: 15,
    totalFloors: 20,
    image: property3,
    images: [property3, property2, property1],
    priceHistory: [
      { date: '2025-10', price: 12000000 },
      { date: '2025-12', price: 11800000 },
      { date: '2026-02', price: 11600000 },
      { date: '2026-04', price: 11500000 },
    ],
    priceScore: 'fair',
    trend: 'down',
    trendPercent: -4.2,
    description: 'Стильная квартира с большой террасой и видом на горы. Премиальный жилой комплекс.',
    features: ['Терраса 15м²', 'Вид на горы', 'Премиум-класс', 'Консьерж'],
    source: 'ЦИАН',
    sourceUrl: '#',
    addedDate: '2026-04-07',
    lat: 43.5992,
    lng: 39.7257,
  },
  {
    id: '7',
    title: 'Пентхаус с панорамой',
    address: 'Москва, Пресненская наб., 6',
    price: 45000000,
    pricePerSqm: 375000,
    area: 120,
    rooms: 3,
    floor: 30,
    totalFloors: 30,
    image: property1,
    images: [property1, property2, property3],
    priceHistory: [
      { date: '2025-10', price: 43000000 },
      { date: '2025-12', price: 44000000 },
      { date: '2026-02', price: 44500000 },
      { date: '2026-04', price: 45000000 },
    ],
    priceScore: 'high',
    trend: 'up',
    trendPercent: 4.7,
    description: 'Пентхаус на последнем этаже с панорамным остеклением и видом на Москву-Сити.',
    features: ['Панорамное остекление', 'Москва-Сити', 'Последний этаж', 'Умный дом', 'Терраса'],
    source: 'Яндекс.Недвижимость',
    sourceUrl: '#',
    addedDate: '2026-04-08',
    lat: 55.7494,
    lng: 37.5407,
  },
  {
    id: '8',
    title: 'Студия в курортном районе',
    address: 'Сочи, Курортный пр., 88',
    price: 6300000,
    pricePerSqm: 180000,
    area: 35,
    rooms: 1,
    floor: 7,
    totalFloors: 16,
    image: property2,
    images: [property2, property1, property3],
    priceHistory: [
      { date: '2025-10', price: 6500000 },
      { date: '2025-12', price: 6400000 },
      { date: '2026-02', price: 6350000 },
      { date: '2026-04', price: 6300000 },
    ],
    priceScore: 'low',
    trend: 'down',
    trendPercent: -3.1,
    description: 'Компактная студия в курортном районе. Идеально для сдачи в аренду туристам.',
    features: ['Курортный район', 'Арендный бизнес', 'Бассейн', 'До моря 5 мин'],
    source: 'Авито',
    sourceUrl: '#',
    addedDate: '2026-04-06',
    lat: 43.5720,
    lng: 39.7340,
  },
];

const MOCK_PROJECTS: ChatProject[] = [
  { id: '1', title: 'Квартиры у моря до 10 млн', lastMessage: 'Нашёл 3 варианта в Сочи', updatedAt: new Date('2026-04-08'), pinned: true },
  { id: '2', title: 'Новостройки Москва, сдача 2027', lastMessage: 'Анализ цен по ЖК «Символ»', updatedAt: new Date('2026-04-07'), pinned: false },
  { id: '3', title: 'Инвестиции в студии СПб', lastMessage: 'Средняя доходность 7.2%', updatedAt: new Date('2026-04-06'), pinned: false },
];

export type CityKey = 'moscow' | 'spb' | 'sochi' | 'kazan' | 'novosibirsk';
export type AppMode = 'gpt' | 'catalog';

const CITY_LABELS: Record<CityKey, string> = {
  moscow: 'Москва',
  spb: 'Санкт-Петербург',
  sochi: 'Сочи',
  kazan: 'Казань',
  novosibirsk: 'Новосибирск',
};

export { MOCK_PROPERTIES };

interface ChatStore {
  messages: ChatMessage[];
  projects: ChatProject[];
  selectedProperty: Property | null;
  isPanelOpen: boolean;
  isSidebarOpen: boolean;
  isSidebarPinned: boolean;
  isTyping: boolean;
  isInitialized: boolean;
  selectedCity: CityKey;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  setCity: (city: CityKey) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  selectProperty: (p: Property) => void;
  closePanel: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarPin: () => void;
  simulateAIResponse: (userMessage: string) => void;
  initWelcome: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  projects: MOCK_PROJECTS,
  selectedProperty: null,
  isPanelOpen: false,
  isSidebarOpen: localStorage.getItem('sidebar-pinned') === 'true',
  isSidebarPinned: localStorage.getItem('sidebar-pinned') === 'true',
  isTyping: false,
  isInitialized: false,
  selectedCity: (localStorage.getItem('selected-city') as CityKey) || 'moscow',
  appMode: 'gpt',
  setAppMode: (mode) => set({ appMode: mode }),
  setCity: (city) => {
    localStorage.setItem('selected-city', city);
    set({ selectedCity: city });
  },

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: crypto.randomUUID(), timestamp: new Date() }],
    })),

  selectProperty: (p) => set({ selectedProperty: p, isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebarPin: () => set((s) => {
    const newPinned = !s.isSidebarPinned;
    localStorage.setItem('sidebar-pinned', String(newPinned));
    return { isSidebarPinned: newPinned, isSidebarOpen: newPinned };
  }),

  initWelcome: () => {
    const store = get();
    if (store.isInitialized) return;
    set({ isInitialized: true, isTyping: true });

    setTimeout(() => {
      set({ isTyping: false });
      store.addMessage({
        role: 'assistant',
        content: 'Привет! Я ваш AI-ассистент по недвижимости. Опишите, что вы ищете — например, «квартиры с видом на море до 10 млн» или «новостройки рядом с метро, сдача 2027». Я подберу лучшие варианты и проанализирую цены.',
      });
    }, 6000);
  },

  simulateAIResponse: (userMessage: string) => {
    const store = get();
    const cityLabel = CITY_LABELS[store.selectedCity];
    const fullMessage = `[${cityLabel}] ${userMessage}`;
    store.addMessage({ role: 'user', content: userMessage });
    set({ isTyping: true });

    setTimeout(() => {
      const lower = fullMessage.toLowerCase();
      let response: Omit<ChatMessage, 'id' | 'timestamp'>;

      if (lower.includes('мор') || lower.includes('сочи') || lower.includes('вид')) {
        response = {
          role: 'assistant',
          content: 'Нашёл **3 варианта** по вашему запросу. Обратите внимание на первый — цена снизилась на 7.6% за полгода, сейчас ниже рынка. Вот подборка:',
          properties: MOCK_PROPERTIES.filter(p => p.address.includes('Сочи')),
        };
      } else if (lower.includes('новостройк') || lower.includes('метро') || lower.includes('москв')) {
        response = {
          role: 'assistant',
          content: 'Вот **актуальные новостройки** бизнес-класса с хорошей транспортной доступностью:',
          properties: MOCK_PROPERTIES.filter(p => p.address.includes('Москва')),
        };
      } else if (lower.includes('студи') || lower.includes('инвестиц') || lower.includes('спб') || lower.includes('петербург')) {
        response = {
          role: 'assistant',
          content: 'Студии — отличный вариант для инвестиций. Средняя доходность по СПб — **7.2% годовых**. Вот интересный вариант:',
          properties: [MOCK_PROPERTIES[2]],
        };
      } else {
        response = {
          role: 'assistant',
          content: 'Понял ваш запрос. Уточните, пожалуйста, основные критерии: город, бюджет, количество комнат — и я подберу лучшие варианты с аналитикой цен.',
        };
      }

      set({ isTyping: false });
      store.addMessage(response);
    }, 1500);
  },
}));
