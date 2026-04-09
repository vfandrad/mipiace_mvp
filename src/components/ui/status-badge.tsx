/**
 * Badges de status para pedidos e pagamentos
 */

import { OrderStatus, PaymentStatus } from '@/types/order';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'status-new' },
  preparando: { label: 'Preparando', className: 'status-production' },
  entrega: { label: 'Entrega', className: 'status-ready' },
  finalizado: { label: 'Finalizado', className: 'status-delivered' },
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', config?.className, className)}>
      {config?.label ?? status}
    </span>
  );
}

interface PaymentBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentBadge({ status, className }: PaymentBadgeProps) {
  const isPaid = status === 'pago';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', isPaid ? 'bg-[hsl(var(--status-ready-bg))] text-[hsl(var(--status-ready))]' : 'bg-[hsl(var(--status-production-bg))] text-[hsl(var(--status-production))]', className)}>
      {isPaid ? 'Pago' : 'Pagar na entrega'}
    </span>
  );
}
