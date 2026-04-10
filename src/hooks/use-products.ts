/**
 * Hook para inventário: Produtos, Grupos e Complementos
 * Busca via GET /products/ e atualiza via PATCH /products/{type}/{id}
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, patchInventoryItem } from '@/lib/api';
import { InventoryResponse, ApiProduct, ApiGroup, ApiComplement } from '@/types/order';

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['inventory'] });

  const query = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  const data: InventoryResponse = query.data ?? { products: [], groups: [], complements: [] };

  // Mapa de complementos por ID (para resolver UUIDs nos pedidos)
  const complementMap = new Map<string, ApiComplement>();
  for (const c of data.complements) {
    complementMap.set(c.id, c);
  }

  // Toggle disponibilidade de produto ou complemento
  const toggleMutation = useMutation({
    mutationFn: ({ type, id, is_available }: { type: 'product' | 'complement'; id: string; is_available: boolean }) =>
      patchInventoryItem(type, id, { is_available }),
    onSuccess: invalidate,
  });

  return {
    products: data.products,
    groups: data.groups,
    complements: data.complements,
    complementMap,
    isLoading: query.isLoading,
    error: query.error,
    toggleAvailability: (type: 'product' | 'complement', id: string, is_available: boolean) =>
      toggleMutation.mutate({ type, id, is_available }),
    isSaving: toggleMutation.isPending,
  };
}
