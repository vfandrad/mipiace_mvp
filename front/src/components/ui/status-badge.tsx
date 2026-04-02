/**
 * Badges de status para pedidos e pagamentos
 * Componentes visuais que indicam o estado atual
 */

import { OrderStatus, PaymentStatus } from '@/types/order';
import { cn } from '@/lib/utils';

// Configuração visual de cada status de pedido
const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'status-new' },
  producao: { label: 'Produção', className: 'status-production' },
  pronto: { label: 'Pronto', className: 'status-ready' },
  entregue: { label: 'Entregue', className: 'status-delivered' },
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
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
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        isPaid 
          ? 'bg-status-ready-bg text-status-ready' 
          : 'bg-status-production-bg text-status-production',
        className
      )}
    >
      {isPaid ? 'Pago' : 'Pendente'}
    </span>
  );
}
