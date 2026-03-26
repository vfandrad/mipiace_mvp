/**
 * Página de Dashboard (Admin)
 * Exibe KPIs, gráficos e pedidos recentes
 * Acessível somente via URL /admin
 */

import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { ProductsChart } from '@/components/dashboard/ProductsChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { 
  mockSalesData,
  mockProductSales, 
  mockHourlySales, 
  mockOrders,
  calculateKPIs 
} from '@/lib/mock-data';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const Admin = () => {
  const kpis = calculateKPIs();

  const ordersByStatus = {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Vendas Hoje"
            value={kpis.totalHoje}
            valuePrefix="R$ "
            change={kpis.changePercent}
            changeLabel="vs ontem"
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          />
          <KPICard
            title="Pedidos Hoje"
            value={kpis.pedidosHoje}
            change={8.5}
            changeLabel="vs ontem"
            icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />}
          />
          <KPICard
            title="Ticket Médio"
            value={kpis.ticketMedio.toFixed(2)}
            valuePrefix="R$ "
            change={3.2}
            changeLabel="vs semana passada"
            icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
          />
          <KPICard
            title="Vendas Semana"
            value={kpis.totalSemana}
            valuePrefix="R$ "
            change={12.4}
            changeLabel="vs semana passada"
            icon={<Package className="h-5 w-5 text-muted-foreground" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart data={mockSalesData} />
          <ProductsChart data={mockProductSales} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HourlyChart data={mockHourlySales} />
          
          <div className="kpi-card">
            <h3 className="font-semibold mb-4">Status de Produção</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-status-new-bg">
                <p className="text-3xl font-bold text-status-new">{ordersByStatus.novo}</p>
                <p className="text-sm text-status-new/80 mt-1">Novos</p>
              </div>
              <div className="p-4 rounded-lg bg-status-production-bg">
                <p className="text-3xl font-bold text-status-production">{ordersByStatus.producao}</p>
                <p className="text-sm text-status-production/80 mt-1">Em Produção</p>
              </div>
              <div className="p-4 rounded-lg bg-status-ready-bg">
                <p className="text-3xl font-bold text-status-ready">{ordersByStatus.pronto}</p>
                <p className="text-sm text-status-ready/80 mt-1">Prontos</p>
              </div>
              <div className="p-4 rounded-lg bg-status-delivered-bg">
                <p className="text-3xl font-bold text-status-delivered">{ordersByStatus.entregue}</p>
                <p className="text-sm text-status-delivered/80 mt-1">Entregues</p>
              </div>
            </div>
          </div>
        </div>

        <RecentOrders orders={mockOrders} />
      </main>
    </div>
  );
};

export default Admin;
