/**
 * Hook para pedidos via API FastAPI
 * Usa React Query para cache, refetch e mutations otimistas
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';

export function useOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: 15000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previous = queryClient.getQueryData<Order[]>(['orders']);
      queryClient.setQueryData<Order[]>(['orders'], (old) =>
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
