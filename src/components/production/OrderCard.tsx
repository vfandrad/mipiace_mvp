/**
 * Card de pedido no Kanban — mostra detalhes e botão para avançar status
 * Itens de categoria 'tamanho' exibem notes (sabores escolhidos)
 */

import { Order, OrderStatus } from '@/types/order';
import { PaymentBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, ChefHat, Check, Truck } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getMinutesAgo(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  novo: 'producao',
  producao: 'pronto',
  pronto: 'entregue',
  entregue: null,
};

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  producao: { label: 'Iniciar', icon: <ChefHat className="h-4 w-4" />, className: 'action-btn-warning' },
  pronto: { label: 'Concluir', icon: <Check className="h-4 w-4" />, className: 'action-btn-success' },
  entregue: { label: 'Entregar', icon: <Truck className="h-4 w-4" />, className: 'action-btn-secondary' },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const minutesAgo = getMinutesAgo(order.createdAt);
  const isUrgent = minutesAgo > 15 && order.status !== 'entregue';
  const nextStatus = NEXT_STATUS[order.status];
  const action = nextStatus ? ACTION_CONFIG[nextStatus] : null;

  return (
    <div className={cn(
      'order-card',
      order.status === 'novo' && 'animate-pulse-subtle border-status-new/30',
      isUrgent && 'border-destructive/50'
    )}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">#{order.orderNumber}</span>
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTime(order.createdAt)}</span>
          <span className="text-xs">({minutesAgo}min)</span>
        </div>
      </div>

      {order.customerName && (
        <p className="text-sm text-muted-foreground mb-3">{order.customerName}</p>
      )}

      {/* Itens */}
      <div className="space-y-2 mb-4">
        {order.items.map(item => (
          <div key={item.id} className="text-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-medium">{item.quantity}x {item.name}</span>
                {/* Sabores escolhidos vêm no campo notes para itens de tamanho */}
                {item.category === 'tamanho' && item.notes && (
                  <p className="text-muted-foreground text-xs mt-0.5">🍨 {item.notes}</p>
                )}
                {item.category === 'extra' && (
                  <p className="text-muted-foreground text-xs mt-0.5">+ extra</p>
                )}
              </div>
              <span className="text-muted-foreground">R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t border-border">
        <span className="font-medium">Total</span>
        <span className="text-lg font-semibold">R$ {order.total.toFixed(2)}</span>
      </div>

      {/* Botão de ação */}
      {nextStatus && action && (
        <div className="mt-3">
          <Button onClick={() => onStatusChange(order.id, nextStatus)} className={cn('w-full gap-2', action.className)} size="sm">
            {action.icon}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
