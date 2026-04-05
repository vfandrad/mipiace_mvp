/**
 * Hook para buscar e atualizar pedidos via API
 * Usa React Query para cache, refetch automático e mutations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus, ApiOrder } from "@/lib/api";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";

// Converte o formato da API (snake_case) para o formato do frontend (camelCase)
function toOrder(api: ApiOrder): Order {
  return {
    id: api.id,
    orderNumber: api.order_number,
    status: api.status as OrderStatus,
    paymentStatus: api.payment_status as PaymentStatus,
    order_items: api.order_items,
    total_price: api.total_price,
    customerName: api.customer_name,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

export function useOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    select: (data) => data.map(toOrder),
    refetchInterval: 15000, // Atualiza a cada 15s para ver novos pedidos
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    // Atualização otimista: muda o status localmente antes da resposta da API
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<ApiOrder[]>(["orders"]);
      queryClient.setQueryData<ApiOrder[]>(["orders"], (old) =>
        old?.map((o) =>
          o.id === id
            ? { ...o, status, updated_at: new Date().toISOString() }
            : o,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(["orders"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    changeStatus: (id: string, status: OrderStatus) =>
      mutation.mutate({ id, status }),
  };
}
