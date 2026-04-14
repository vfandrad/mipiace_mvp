/**
 * Card de pedido no Kanban — exibe detalhes e botão para avançar status
 * Resolve complement_ids usando o cache de inventário
 */

import { Order, OrderStatus, ApiComplement } from '@/types/order';
import { PaymentBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, ChefHat, Check, Truck, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  complementMap: Map<string, ApiComplement>;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getMinutesAgo(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

// Fluxo: novo → preparando → entrega → finalizado
const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  novo: 'preparando',
  preparando: 'entrega',
  entrega: 'finalizado',
  finalizado: null,
};

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  preparando: { label: 'Iniciar', icon: <ChefHat className="h-4 w-4" />, className: 'action-btn-warning' },
  entrega: { label: 'Saiu p/ Entrega', icon: <Truck className="h-4 w-4" />, className: 'action-btn-success' },
  finalizado: { label: 'Finalizar', icon: <Check className="h-4 w-4" />, className: 'action-btn-secondary' },
};

export function OrderCard({ order, complementMap, onStatusChange }: OrderCardProps) {
  const minutesAgo = getMinutesAgo(order.createdAt);
  const isUrgent = minutesAgo > 15 && order.status !== 'finalizado';
  const nextStatus = NEXT_STATUS[order.status];
  const action = nextStatus ? ACTION_CONFIG[nextStatus] : null;

  return (
    <div className={cn(
      'order-card',
      order.status === 'novo' && 'animate-pulse-subtle border-status-new/30',
      isUrgent && 'border-destructive/50'
    )}>
      {/* Cabeçalho: nome do cliente + tempo */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-foreground truncate">{order.customerName || 'Cliente'}</span>
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTime(order.createdAt)}</span>
          <span className="text-xs">({minutesAgo}min)</span>
        </div>
      </div>

      {/* Badge de pagamento */}
      <div className="mb-3">
        <PaymentBadge status={order.paymentStatus} />
      </div>

      {/* Endereço */}
      <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-3">
        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          {order.address.rua}, {order.address.numero} — {order.address.bairro}
          {order.address.complemento && ` (${order.address.complemento})`}
        </span>
      </div>

      {/* Itens do pedido */}
      <div className="space-y-2 mb-4">
        {(order.items ?? []).map(item => {
          // Resolve nomes dos complementos a partir dos IDs
          const resolvedComplements = (item.complement_ids ?? [])
            .map(cId => complementMap.get(cId))
            .filter(Boolean) as ApiComplement[];

          return (
            <div key={item.id} className="text-sm">
              <span className="font-medium">{item.quantity}x {item.products?.name ?? 'Produto'}</span>
              {item.details && (
                <p className="text-muted-foreground text-xs italic mt-0.5">{item.details}</p>
              )}
              {resolvedComplements.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {resolvedComplements.map(c => (
                    <span key={c.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                      {c.name}{c.extra_price > 0 && ` +R$${c.extra_price.toFixed(2)}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t border-border">
        <span className="font-medium">Total</span>
        <span className="text-lg font-semibold">R$ {(order.totalPrice ?? 0).toFixed(2)}</span>
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
