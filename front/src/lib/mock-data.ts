/**
 * Dados de exemplo (mock) para desenvolvimento
 * Em produção, esses dados viriam de uma API/banco de dados
 */

import { 
  Order, 
  SalesData, 
  ProductSalesData, 
  HourlySalesData 
} from '@/types/order';

// ========================================
// Pedidos de exemplo para o Kanban
// ========================================
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 1001,
    status: 'novo',
    paymentStatus: 'pago',
    items: [
      { id: '1a', name: 'Pote 500ml', quantity: 1, flavors: ['Pistache', 'Doce de Leite'], accompaniments: ['Cascão Artesanal'], price: 50.00 },
      { id: '1b', name: 'Pote 240ml', quantity: 2, flavors: ['Romeu e Julieta'], accompaniments: [], price: 30.00 },
    ],
    total: 116.00,
    customerName: 'João Silva',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    orderNumber: 1002,
    status: 'novo',
    paymentStatus: 'pendente',
    items: [
      { id: '2a', name: 'Pote 500ml', quantity: 1, flavors: ['Ninho com Nutella', 'Café Robusta'], accompaniments: ['Cascão Artesanal', 'Cascão Artesanal'], price: 50.00 },
    ],
    total: 56.00,
    customerName: 'Maria Santos',
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '3',
    orderNumber: 1003,
    status: 'producao',
    paymentStatus: 'pago',
    items: [
      { id: '3a', name: 'Pote 500ml', quantity: 2, flavors: ['Limão Siciliano', 'Morango Zero Lactose'], accompaniments: [], price: 50.00 },
      { id: '3b', name: 'Pote 240ml', quantity: 1, flavors: ['Pavlova'], accompaniments: ['Cascão Artesanal'], price: 30.00 },
    ],
    total: 133.00,
    customerName: 'Pedro Costa',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '4',
    orderNumber: 1004,
    status: 'producao',
    paymentStatus: 'pago',
    items: [
      { id: '4a', name: 'Pote 240ml', quantity: 3, flavors: ['Fior di Latte Zero Açúcar', 'Iogurte com Amarena'], accompaniments: [], price: 30.00 },
    ],
    total: 90.00,
    customerName: 'Ana Lima',
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: '5',
    orderNumber: 1005,
    status: 'pronto',
    paymentStatus: 'pago',
    items: [
      { id: '5a', name: 'Pote 500ml', quantity: 2, flavors: ['Cupuaçu', 'Coco Branco'], accompaniments: ['Cascão Artesanal'], price: 50.00 },
    ],
    total: 103.00,
    customerName: 'Carlos Mendes',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '6',
    orderNumber: 1006,
    status: 'pronto',
    paymentStatus: 'pendente',
    items: [
      { id: '6a', name: 'Pote 500ml', quantity: 1, flavors: ['Paçoquinha', 'Chocolate Zero Açúcar'], accompaniments: [], price: 50.00 },
    ],
    total: 50.00,
    customerName: 'Fernanda Alves',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '7',
    orderNumber: 1000,
    status: 'entregue',
    paymentStatus: 'pago',
    items: [
      { id: '7a', name: 'Pote 240ml', quantity: 2, flavors: ['Maracujá', 'Frutas Vermelhas Zero Lactose'], accompaniments: ['Cascão Artesanal'], price: 30.00 },
    ],
    total: 63.00,
    customerName: 'Roberto Dias',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000),
  },
];

// ========================================
// Dados para gráficos do Dashboard
// ========================================

export const mockSalesData: SalesData[] = [
  { date: '2024-01-20', total: 2450.00, orders: 52 },
  { date: '2024-01-21', total: 2880.00, orders: 61 },
  { date: '2024-01-22', total: 2120.00, orders: 45 },
  { date: '2024-01-23', total: 3150.00, orders: 68 },
  { date: '2024-01-24', total: 3590.00, orders: 76 },
  { date: '2024-01-25', total: 4100.00, orders: 89 },
  { date: '2024-01-26', total: 3850.00, orders: 82 },
];

export const mockProductSales: ProductSalesData[] = [
  { name: 'Pote 500ml', sales: 245, revenue: 12250 },
  { name: 'Pote 240ml', sales: 189, revenue: 5670 },
  { name: 'Cascão Artesanal', sales: 312, revenue: 936 },
];

export const mockHourlySales: HourlySalesData[] = [
  { hour: '10h', orders: 8, revenue: 280 },
  { hour: '11h', orders: 15, revenue: 540 },
  { hour: '12h', orders: 28, revenue: 1020 },
  { hour: '13h', orders: 35, revenue: 1280 },
  { hour: '14h', orders: 22, revenue: 790 },
  { hour: '15h', orders: 18, revenue: 640 },
  { hour: '16h', orders: 25, revenue: 890 },
  { hour: '17h', orders: 32, revenue: 1160 },
  { hour: '18h', orders: 40, revenue: 1450 },
  { hour: '19h', orders: 38, revenue: 1380 },
  { hour: '20h', orders: 28, revenue: 1020 },
  { hour: '21h', orders: 15, revenue: 540 },
];

// ========================================
// Funções utilitárias para KPIs
// ========================================

/**
 * Calcula os indicadores principais do dashboard
 * Usa os dados mock de vendas para gerar métricas
 */
export function calculateKPIs() {
  const today = mockSalesData[mockSalesData.length - 1];
  const yesterday = mockSalesData[mockSalesData.length - 2];
  
  const weekTotal = mockSalesData.reduce((acc, day) => acc + day.total, 0);
  const weekOrders = mockSalesData.reduce((acc, day) => acc + day.orders, 0);
  
  const ticketMedio = weekTotal / weekOrders;
  const changePercent = ((today.total - yesterday.total) / yesterday.total) * 100;
  
  return {
    totalHoje: today.total,
    totalSemana: weekTotal,
    ticketMedio,
    pedidosHoje: today.orders,
    pedidosSemana: weekOrders,
    changePercent,
  };
}
