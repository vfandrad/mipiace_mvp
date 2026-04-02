/**
 * Dashboard (Admin) — KPIs, gráficos e pedidos recentes
 * Dados vêm da API via useOrders e useOrderStats
 */

import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ProductsChart } from '@/components/dashboard/ProductsChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/hooks/use-orders';
import { useOrderStats } from '@/hooks/use-order-stats';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const Admin = () => {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { salesData, productSales, hourlySales, kpis, isLoading: statsLoading } = useOrderStats();

  const isLoading = ordersLoading || statsLoading;

  // Conta pedidos por status usando dados reais da API
  const statusCount = {
    novo: orders.filter(o => o.status === 'novo').length,
    producao: orders.filter(o => o.status === 'producao').length,
    pronto: orders.filter(o => o.status === 'pronto').length,
    entregue: orders.filter(o => o.status === 'entregue').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe o desempenho da sua gelateria</p>
          </div>
          <DateFilter />
        </div>

        {/* KPIs */}
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
          </div>
        ) : kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Vendas Hoje" value={kpis.totalHoje} valuePrefix="R$ " change={kpis.changePercent} changeLabel="vs ontem" icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} />
            <KPICard title="Pedidos Hoje" value={kpis.pedidosHoje} change={0} changeLabel="vs ontem" icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />} />
            <KPICard title="Ticket Médio" value={kpis.ticketMedio.toFixed(2)} valuePrefix="R$ " change={0} changeLabel="vs semana passada" icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
            <KPICard title="Vendas Semana" value={kpis.totalSemana} valuePrefix="R$ " change={0} changeLabel="vs semana passada" icon={<Package className="h-5 w-5 text-muted-foreground" />} />
          </div>
        ) : null}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {statsLoading ? (
            <>
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
            </>
          ) : (
            <>
              <SalesChart data={salesData} />
              <ProductsChart data={productSales} />
              <HourlyChart data={hourlySales} />
            </>
          )}
          <div className="kpi-card">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Status de Produção</h3>
            {ordersLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'novo', label: 'Novos', bg: 'bg-status-new-bg', text: 'text-status-new' },
                  { key: 'producao', label: 'Em Produção', bg: 'bg-status-production-bg', text: 'text-status-production' },
                  { key: 'pronto', label: 'Prontos', bg: 'bg-status-ready-bg', text: 'text-status-ready' },
                  { key: 'entregue', label: 'Entregues', bg: 'bg-status-delivered-bg', text: 'text-status-delivered' },
                ] as const).map(s => (
                  <div key={s.key} className={`p-3 sm:p-4 rounded-lg ${s.bg}`}>
                    <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>{statusCount[s.key]}</p>
                    <p className={`text-xs sm:text-sm ${s.text}/80 mt-1`}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {ordersLoading ? (
          <Skeleton className="h-48 rounded-lg" />
        ) : (
          <RecentOrders orders={orders} />
        )}
      </main>
    </div>
  );
};

export default Admin;
