/** Hook de pedidos — busca e atualiza status via API */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { Order, OrderStatus, ApiOrder } from '@/types/order';

/** Converte formato da API para formato do frontend */
function toOrder(api: ApiOrder): Order {
  return {
    id: api.id,
    customerName: api.customer_name ?? '',
    customerPhone: api.customer_phone,
    totalPrice: api.total_price ?? 0,
    address: {
      rua: api.rua ?? '',
      numero: api.numero ?? '',
      bairro: api.bairro ?? '',
      complemento: api.complemento_endereco,
    },
    status: api.status as OrderStatus,
    paymentStatus: api.payment_status as 'pago' | 'pendente',
    createdAt: new Date(api.created_at),
    items: api.order_items ?? [],
  };
}

export function useOrders() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    select: (data) => (data ?? []).map(toOrder),
    refetchInterval: 15000, // Atualiza a cada 15s
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    // Optimistic UI
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['orders'] });
      const prev = qc.getQueryData<ApiOrder[]>(['orders']);
      qc.setQueryData<ApiOrder[]>(['orders'], (old) =>
        old?.map((o) => (o.id === id ? { ...o, status } : o))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['orders'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    changeStatus: (id: string, status: OrderStatus) => mutation.mutate({ id, status }),
  };
}
