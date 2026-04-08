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
  },
];

const MOCK_PROJECTS: ChatProject[] = [
  { id: '1', title: 'Квартиры у моря до 10 млн', lastMessage: 'Нашёл 3 варианта в Сочи', updatedAt: new Date('2026-04-08'), pinned: true },
  { id: '2', title: 'Новостройки Москва, сдача 2027', lastMessage: 'Анализ цен по ЖК «Символ»', updatedAt: new Date('2026-04-07'), pinned: false },
  { id: '3', title: 'Инвестиции в студии СПб', lastMessage: 'Средняя доходность 7.2%', updatedAt: new Date('2026-04-06'), pinned: false },
];

interface ChatStore {
  messages: ChatMessage[];
  projects: ChatProject[];
  selectedProperty: Property | null;
  isPanelOpen: boolean;
  isSidebarOpen: boolean;
  isSidebarPinned: boolean;
  isTyping: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  selectProperty: (p: Property) => void;
  closePanel: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarPin: () => void;
  simulateAIResponse: (userMessage: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: '0',
      role: 'assistant',
      content: 'Привет! Я ваш AI-ассистент по недвижимости. Опишите, что вы ищете — например, «квартиры с видом на море до 10 млн» или «новостройки рядом с метро, сдача 2027». Я подберу лучшие варианты и проанализирую цены.',
      timestamp: new Date(),
    },
  ],
  projects: MOCK_PROJECTS,
  selectedProperty: null,
  isPanelOpen: false,
  isSidebarOpen: localStorage.getItem('sidebar-pinned') === 'true',
  isSidebarPinned: localStorage.getItem('sidebar-pinned') === 'true',
  isTyping: false,

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

  simulateAIResponse: (userMessage: string) => {
    const store = get();
    store.addMessage({ role: 'user', content: userMessage });
    set({ isTyping: true });

    setTimeout(() => {
      const lower = userMessage.toLowerCase();
      let response: Omit<ChatMessage, 'id' | 'timestamp'>;

      if (lower.includes('мор') || lower.includes('сочи') || lower.includes('вид')) {
        response = {
          role: 'assistant',
          content: 'Нашёл **3 варианта** по вашему запросу. Обратите внимание на первый — цена снизилась на 7.6% за полгода, сейчас ниже рынка. Вот подборка:',
          properties: MOCK_PROPERTIES,
        };
      } else if (lower.includes('новостройк') || lower.includes('метро') || lower.includes('москв')) {
        response = {
          role: 'assistant',
          content: 'Вот **актуальные новостройки** бизнес-класса с хорошей транспортной доступностью:',
          properties: [MOCK_PROPERTIES[1]],
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
