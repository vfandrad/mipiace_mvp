/**
 * Hook para buscar e atualizar pedidos via API
 * Converte o formato da API para o formato do frontend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { Order, OrderStatus, ApiOrder } from '@/types/order';

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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    select: (data) => (data ?? []).map(toOrder),
    refetchInterval: 15000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    // Atualização otimista
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previous = queryClient.getQueryData<ApiOrder[]>(['orders']);
      queryClient.setQueryData<ApiOrder[]>(['orders'], (old) =>
        old?.map((o) => (o.id === id ? { ...o, status } : o))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['orders'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    changeStatus: (id: string, status: OrderStatus) => mutation.mutate({ id, status }),
  };
}
