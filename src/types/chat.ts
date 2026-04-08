export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  pricePerSqm: number;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  image: string;
  images: string[];
  priceHistory: { date: string; price: number }[];
  priceScore: 'low' | 'fair' | 'high';
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  description: string;
  features: string[];
  source: string;
  sourceUrl: string;
  addedDate: string;
  lat?: number;
  lng?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  properties?: Property[];
}

export interface ChatProject {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  pinned: boolean;
}
