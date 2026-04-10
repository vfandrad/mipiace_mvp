/**
 * Página de Produção — quadro Kanban para gerenciar pedidos
 * Carrega inventário para resolver nomes dos complementos
 */

import { Header } from '@/components/layout/Header';
import { KanbanColumn } from '@/components/production/KanbanColumn';
import { OrderStatus } from '@/types/order';
import { useOrders } from '@/hooks/use-orders';
import { useProducts } from '@/hooks/use-products';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_LABELS: Record<OrderStatus, string> = {
  novo: 'Novo',
  preparando: 'Preparando',
  entrega: 'Saiu p/ Entrega',
  finalizado: 'Finalizado',
};

const KANBAN_STATUSES: OrderStatus[] = ['novo', 'preparando', 'entrega', 'finalizado'];

const Loja = () => {
  const { orders, isLoading } = useOrders();
  const { complementMap } = useProducts();
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    changeStatus(orderId, newStatus);
    toast({ title: 'Status atualizado', description: `Pedido movido para ${STATUS_LABELS[newStatus]}` });
  };

  const { changeStatus } = useOrders();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Produção</h1>
          <p className="text-muted-foreground">Gerencie o fluxo de pedidos</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_STATUSES.map(s => (
              <Skeleton key={s} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                orders={orders.filter(o => o.status === status)}
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
