export interface Asset {
  ticker: string;
  name: string;
  type: 'Ação' | 'FII';
  price: number;
  change: number;
  dy: number;
  pvp: number;
  marketCap: number;
  projectedReturn: number;
  nextDividend?: {
    date: string;
    value: number;
  };
  sector: string;
  history: { date: string; price: number }[];
}

export const MOCK_ASSETS: Asset[] = [
  {
    ticker: 'PETR4',
    name: 'Petrobras PN',
    type: 'Ação',
    price: 38.45,
    change: 1.2,
    dy: 14.5,
    pvp: 1.1,
    marketCap: 520000000000,
    projectedReturn: 18.5,
    nextDividend: { date: '2024-05-20', value: 1.15 },
    sector: 'Petróleo e Gás',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 35 + Math.random() * 5 }))
  },
  {
    ticker: 'MXRF11',
    name: 'Maxi Renda FII',
    type: 'FII',
    price: 10.52,
    change: -0.4,
    dy: 12.8,
    pvp: 1.05,
    marketCap: 2500000000,
    projectedReturn: 13.2,
    nextDividend: { date: '2024-04-15', value: 0.10 },
    sector: 'Papel',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 10 + Math.random() * 1 }))
  },
  {
    ticker: 'VALE3',
    name: 'Vale ON',
    type: 'Ação',
    price: 65.20,
    change: -2.1,
    dy: 8.2,
    pvp: 0.95,
    marketCap: 310000000000,
    projectedReturn: 12.8,
    sector: 'Mineração',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 60 + Math.random() * 10 }))
  },
  {
    ticker: 'HGLG11',
    name: 'CGHG Logística FII',
    type: 'FII',
    price: 165.40,
    change: 0.15,
    dy: 9.1,
    pvp: 1.02,
    marketCap: 3800000000,
    projectedReturn: 10.5,
    nextDividend: { date: '2024-04-14', value: 1.10 },
    sector: 'Logística',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 160 + Math.random() * 10 }))
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco PN',
    type: 'Ação',
    price: 32.15,
    change: 0.8,
    dy: 6.5,
    pvp: 1.45,
    marketCap: 280000000000,
    projectedReturn: 15.2,
    sector: 'Financeiro',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 30 + Math.random() * 4 }))
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil ON',
    type: 'Ação',
    price: 27.80,
    change: 1.5,
    dy: 10.2,
    pvp: 0.88,
    marketCap: 160000000000,
    projectedReturn: 16.8,
    nextDividend: { date: '2024-06-12', value: 0.45 },
    sector: 'Financeiro',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 25 + Math.random() * 5 }))
  },
  {
    ticker: 'KNRI11',
    name: 'Kinea Renda Imob. FII',
    type: 'FII',
    price: 158.30,
    change: -0.2,
    dy: 8.5,
    pvp: 0.98,
    marketCap: 4200000000,
    projectedReturn: 11.2,
    nextDividend: { date: '2024-04-10', value: 1.00 },
    sector: 'Híbrido',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 155 + Math.random() * 8 }))
  },
  {
    ticker: 'ABEV3',
    name: 'Ambev ON',
    type: 'Ação',
    price: 12.45,
    change: -0.5,
    dy: 6.2,
    pvp: 2.1,
    marketCap: 195000000000,
    projectedReturn: 9.5,
    sector: 'Consumo',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 11 + Math.random() * 2 }))
  },
  {
    ticker: 'VISC11',
    name: 'Vinci Shopping FII',
    type: 'FII',
    price: 118.90,
    change: 0.6,
    dy: 9.8,
    pvp: 1.01,
    marketCap: 2800000000,
    projectedReturn: 12.5,
    nextDividend: { date: '2024-04-18', value: 1.00 },
    sector: 'Shoppings',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 115 + Math.random() * 10 }))
  },
  {
    ticker: 'WEGE3',
    name: 'Weg ON',
    type: 'Ação',
    price: 38.90,
    change: 2.3,
    dy: 1.8,
    pvp: 8.5,
    marketCap: 165000000000,
    projectedReturn: 14.2,
    sector: 'Bens Industriais',
    history: Array.from({ length: 20 }, (_, i) => ({ date: `2024-01-${i + 1}`, price: 35 + Math.random() * 6 }))
  }
];
