/**
 * Página de Produção — quadro Kanban para gerenciar pedidos
 */

import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { KanbanColumn } from '@/components/production/KanbanColumn';
import { OrderStatus } from '@/types/order';
import { mockOrders } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const STATUS_LABELS: Record<OrderStatus, string> = {
  novo: 'Novo',
  producao: 'Em Produção',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

const KANBAN_STATUSES: OrderStatus[] = ['novo', 'producao', 'pronto', 'entregue'];

const Loja = () => {
  const [orders, setOrders] = useState(mockOrders);
  const { toast } = useToast();

  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
    toast({ title: 'Status atualizado', description: `Pedido movido para ${STATUS_LABELS[newStatus]}` });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Produção</h1>
          <p className="text-muted-foreground">Gerencie o fluxo de pedidos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {KANBAN_STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              orders={orders.filter(o => o.status === status)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Loja;
