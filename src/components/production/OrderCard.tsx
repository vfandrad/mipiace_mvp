/**
 * Card de pedido no Kanban — layout compacto com dados da API FastAPI
 */

import { Order, OrderStatus } from '@/types/order';
import { PaymentBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, ChefHat, Check, Truck, MapPin, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '--:--';
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getMinutesAgo(dateStr?: string): number {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  novo: 'preparando',
  preparando: 'entrega',
  entrega: 'finalizado',
  finalizado: null,
};

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  preparando: { label: 'Iniciar', icon: <ChefHat className="h-4 w-4" />, className: 'action-btn-warning' },
  entrega: { label: 'Pronto', icon: <Check className="h-4 w-4" />, className: 'action-btn-success' },
  finalizado: { label: 'Entregar', icon: <Truck className="h-4 w-4" />, className: 'action-btn-secondary' },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const minutesAgo = getMinutesAgo(order.created_at);
  const isUrgent = minutesAgo > 15 && order.status !== 'finalizado';
  const nextStatus = NEXT_STATUS[order.status];
  const action = nextStatus ? ACTION_CONFIG[nextStatus] : null;

  const endereco = [order.rua, order.numero].filter(Boolean).join(', ');
  const enderecoCompleto = [endereco, order.bairro].filter(Boolean).join(' - ');

  return (
    <div className={cn(
      'order-card',
      order.status === 'novo' && 'animate-pulse-subtle border-[hsl(var(--status-new))]/30',
      isUrgent && 'border-destructive/50'
    )}>
      {/* Cabeçalho: nome + horário */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">{order.customer_name || 'Cliente'}</span>
          {order.payment_status && <PaymentBadge status={order.payment_status} />}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTime(order.created_at)}</span>
          <span>({minutesAgo}min)</span>
        </div>
      </div>

      {/* Endereço */}
      {enderecoCompleto && (
        <div className="flex items-start gap-1 mb-3 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{enderecoCompleto}</span>
        </div>
      )}

      {/* Itens detalhados */}
      <div className="space-y-2 mb-3">
        {(order.itens_detalhados ?? []).map((item, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-medium">{item.quantidade}x {item.produto}</span>
            {item.escolhas && item.escolhas.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.escolhas.map((e, i) => (
                  <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">
                    {e}
                  </Badge>
                ))}
              </div>
            )}
            {item.observacoes && (
              <p className="text-xs text-muted-foreground italic mt-0.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {item.observacoes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-2 border-t border-border">
        <span className="text-sm font-medium">Total</span>
        <span className="font-semibold">R$ {(order.total_price ?? 0).toFixed(2)}</span>
      </div>

      {/* Botão de ação */}
      {nextStatus && action && (
        <div className="mt-2">
          <Button onClick={() => onStatusChange(order.id, nextStatus)} className={cn('w-full gap-2', action.className)} size="sm">
            {action.icon}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
