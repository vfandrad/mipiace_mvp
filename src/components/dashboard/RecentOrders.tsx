/**
 * Tabela de pedidos recentes — adaptada para novo formato da API
 */

import { Order } from '@/types/order';
import { StatusBadge, PaymentBadge } from '@/components/ui/status-badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="kpi-card">
      <h3 className="font-semibold mb-4">Pedidos Recentes</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="animate-fade-in">
                  <TableCell>{order.customer_name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {(order.itens_detalhados ?? []).map(i => `${i.quantidade}x ${i.produto}`).join(', ')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {(order.total_price ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    {order.payment_status && <PaymentBadge status={order.payment_status} />}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.created_at ? new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
