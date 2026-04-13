/** Dashboard — KPIs, gráficos e pedidos recentes */

import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ProductsChart } from '@/components/dashboard/ProductsChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/hooks/use-orders';
import { mockSalesData, mockProductSales, mockHourlySales, calculateKPIs } from '@/lib/mock-data';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { OrderStatus } from '@/types/order';

const STATUS_UI: { key: OrderStatus; label: string; bg: string; text: string }[] = [
  { key: 'novo', label: 'Novos', bg: 'bg-status-new-bg', text: 'text-status-new' },
  { key: 'preparando', label: 'Preparando', bg: 'bg-status-production-bg', text: 'text-status-production' },
  { key: 'entrega', label: 'Entrega', bg: 'bg-status-ready-bg', text: 'text-status-ready' },
  { key: 'finalizado', label: 'Finalizados', bg: 'bg-status-delivered-bg', text: 'text-status-delivered' },
];

const Admin = () => {
  const { orders, isLoading } = useOrders();
  const kpis = calculateKPIs();

  const countByStatus = (status: OrderStatus) => orders.filter(o => o.status === status).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o desempenho da sua gelateria</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard title="Vendas Hoje" value={kpis.totalHoje} valuePrefix="R$ " change={kpis.changePercent} changeLabel="vs ontem" icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Pedidos Hoje" value={kpis.pedidosHoje} change={8.5} changeLabel="vs ontem" icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Ticket Médio" value={kpis.ticketMedio.toFixed(2)} valuePrefix="R$ " change={3.2} changeLabel="vs semana" icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Vendas Semana" value={kpis.totalSemana} valuePrefix="R$ " change={12.4} changeLabel="vs semana" icon={<Package className="h-5 w-5 text-muted-foreground" />} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart data={mockSalesData} />
          <ProductsChart data={mockProductSales} />
          <HourlyChart data={mockHourlySales} />

          {/* Status de produção */}
          <div className="kpi-card">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Status de Produção</h3>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {STATUS_UI.map(s => (
                  <div key={s.key} className={`p-3 sm:p-4 rounded-lg ${s.bg}`}>
                    <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>{countByStatus(s.key)}</p>
                    <p className={`text-xs sm:text-sm ${s.text}/80 mt-1`}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? <Skeleton className="h-48 rounded-lg" /> : <RecentOrders orders={orders} />}
      </main>
    </div>
  );
};

export default Admin;
