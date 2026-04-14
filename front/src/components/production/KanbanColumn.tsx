/**
 * Coluna do quadro Kanban
 */

import { Order, OrderStatus, ApiComplement } from '@/types/order';
import { OrderCard } from './OrderCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: OrderStatus;
  orders: Order[];
  complementMap: Map<string, ApiComplement>;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const COLUMN_CONFIG: Record<OrderStatus, { title: string; borderColor: string }> = {
  novo: { title: 'Novos', borderColor: 'border-b-status-new' },
  preparando: { title: 'Preparando', borderColor: 'border-b-status-production' },
  entrega: { title: 'Saiu p/ Entrega', borderColor: 'border-b-status-ready' },
  finalizado: { title: 'Finalizados', borderColor: 'border-b-status-delivered' },
};

export function KanbanColumn({ status, orders, complementMap, onStatusChange }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="kanban-column flex flex-col">
      <div className={cn('pb-3 mb-4 border-b-2', config.borderColor)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{config.title}</h3>
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-card text-sm font-medium shadow-sm">
            {orders.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-1">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Nenhum pedido
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} complementMap={complementMap} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}
