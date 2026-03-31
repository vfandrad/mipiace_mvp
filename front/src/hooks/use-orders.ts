import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Order } from '@/types';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // 1. Buscar todos os pedidos
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  // 2. Atualizar Status (Mover no Kanban)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/orders/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      // Força a atualização da lista após mudar um status
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    updateStatus: updateStatusMutation.mutate,
  };
};