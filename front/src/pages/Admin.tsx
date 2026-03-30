/**
 * Dashboard (Admin) — KPIs, gráficos e pedidos recentes
 * Acessível apenas via /admin
 */

import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ProductsChart } from '@/components/dashboard/ProductsChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { mockSalesData, mockProductSales, mockHourlySales, mockOrders, calculateKPIs } from '@/lib/mock-data';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const Admin = () => {
  const kpis = calculateKPIs();

  // Conta pedidos por status para o painel de produção
  const statusCount = {
    novo: mockOrders.filter(o => o.status === 'novo').length,
    producao: mockOrders.filter(o => o.status === 'producao').length,
    pronto: mockOrders.filter(o => o.status === 'pronto').length,
    entregue: mockOrders.filter(o => o.status === 'entregue').length,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Vendas Hoje" value={kpis.totalHoje} valuePrefix="R$ " change={kpis.changePercent} changeLabel="vs ontem" icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Pedidos Hoje" value={kpis.pedidosHoje} change={8.5} changeLabel="vs ontem" icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Ticket Médio" value={kpis.ticketMedio.toFixed(2)} valuePrefix="R$ " change={3.2} changeLabel="vs semana passada" icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
          <KPICard title="Vendas Semana" value={kpis.totalSemana} valuePrefix="R$ " change={12.4} changeLabel="vs semana passada" icon={<Package className="h-5 w-5 text-muted-foreground" />} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SalesChart data={mockSalesData} />
          <ProductsChart data={mockProductSales} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HourlyChart data={mockHourlySales} />
          <div className="kpi-card">
            <h3 className="font-semibold mb-4">Status de Produção</h3>
            <div className="grid grid-cols-2 gap-4">
              {([
                { key: 'novo', label: 'Novos', bg: 'bg-status-new-bg', text: 'text-status-new' },
                { key: 'producao', label: 'Em Produção', bg: 'bg-status-production-bg', text: 'text-status-production' },
                { key: 'pronto', label: 'Prontos', bg: 'bg-status-ready-bg', text: 'text-status-ready' },
                { key: 'entregue', label: 'Entregues', bg: 'bg-status-delivered-bg', text: 'text-status-delivered' },
              ] as const).map(s => (
                <div key={s.key} className={`p-4 rounded-lg ${s.bg}`}>
                  <p className={`text-3xl font-bold ${s.text}`}>{statusCount[s.key]}</p>
                  <p className={`text-sm ${s.text}/80 mt-1`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <RecentOrders orders={mockOrders} />
      </main>
    </div>
  );
};

export default Admin;
