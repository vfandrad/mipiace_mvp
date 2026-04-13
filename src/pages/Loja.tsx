/** Página de Produção — quadro Kanban de pedidos */

import { Header } from '@/components/layout/Header';
import { KanbanColumn } from '@/components/production/KanbanColumn';
import { OrderStatus } from '@/types/order';
import { useOrders } from '@/hooks/use-orders';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const KANBAN_STATUSES: { key: OrderStatus; title: string }[] = [
  { key: 'novo', title: 'Novos' },
  { key: 'preparando', title: 'Preparando' },
  { key: 'entrega', title: 'Saiu p/ Entrega' },
  { key: 'finalizado', title: 'Finalizados' },
];

const Loja = () => {
  const { orders, isLoading, changeStatus } = useOrders();
  const { complementMap } = useProducts();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    changeStatus(orderId, newStatus);
    toast.success(`Pedido movido para "${KANBAN_STATUSES.find(s => s.key === newStatus)?.title}"`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Produção</h1>
          <p className="text-muted-foreground text-sm">Gerencie o fluxo de pedidos</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_STATUSES.map(s => (
              <Skeleton key={s.key} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_STATUSES.map(({ key }) => (
              <KanbanColumn
                key={key}
                status={key}
                orders={orders.filter(o => o.status === key)}
                complementMap={complementMap}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Loja;
