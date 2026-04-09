/**
 * Dados de exemplo (mock) para gráficos do Dashboard
 * Pedidos agora vêm da API — mocks só para vendas/gráficos
 */

import { 
  SalesData, 
  ProductSalesData, 
  HourlySalesData 
} from '@/types/order';

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

export function calculateKPIs() {
  const today = mockSalesData[mockSalesData.length - 1];
  const yesterday = mockSalesData[mockSalesData.length - 2];
  const weekTotal = mockSalesData.reduce((acc, day) => acc + day.total, 0);
  const weekOrders = mockSalesData.reduce((acc, day) => acc + day.orders, 0);
  const ticketMedio = weekTotal / weekOrders;
  const changePercent = ((today.total - yesterday.total) / yesterday.total) * 100;
  return { totalHoje: today.total, totalSemana: weekTotal, ticketMedio, pedidosHoje: today.orders, pedidosSemana: weekOrders, changePercent };
}
