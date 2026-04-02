/**
 * Hook para buscar estatísticas de pedidos (dashboard)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOrderStats, ApiOrderStats } from '@/lib/api';
import { SalesData, ProductSalesData, HourlySalesData } from '@/types/order';

export interface DashboardKPIs {
  totalHoje: number;
  totalSemana: number;
  ticketMedio: number;
  pedidosHoje: number;
  changePercent: number;
}

function mapStats(data: ApiOrderStats) {
  const salesData: SalesData[] = data.daily_sales.map(d => ({
    date: d.date,
    total: d.total,
    orders: d.orders,
  }));

  const productSales: ProductSalesData[] = data.product_sales.map(p => ({
    name: p.name,
    sales: p.sales,
    revenue: p.revenue,
  }));

  const hourlySales: HourlySalesData[] = data.hourly_sales.map(h => ({
    hour: h.hour,
    orders: h.orders,
    revenue: h.revenue,
  }));

  const kpis: DashboardKPIs = {
    totalHoje: data.kpis.total_hoje,
    totalSemana: data.kpis.total_semana,
    ticketMedio: data.kpis.ticket_medio,
    pedidosHoje: data.kpis.pedidos_hoje,
    changePercent: data.kpis.change_percent,
  };

  return { salesData, productSales, hourlySales, kpis };
}

export function useOrderStats() {
  const query = useQuery({
    queryKey: ['order-stats'],
    queryFn: fetchOrderStats,
    select: mapStats,
    refetchInterval: 60000, // Atualiza a cada 60s
  });

  return {
    salesData: query.data?.salesData ?? [],
    productSales: query.data?.productSales ?? [],
    hourlySales: query.data?.hourlySales ?? [],
    kpis: query.data?.kpis ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
