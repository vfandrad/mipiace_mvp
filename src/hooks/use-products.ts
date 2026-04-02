/**
 * Hook para CRUD de produtos/itens via API
 * Suporta categorias (tamanho, sabor, extra) e toggle de disponibilidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct, deleteProduct, ApiProduct, ItemCategory } from '@/lib/api';

export type { ItemCategory } from '@/lib/api';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: ItemCategory;
  maxSabores: number;
  disponivel: boolean;
}

function toProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    nome: api.name,
    preco: api.price,
    categoria: api.category,
    maxSabores: api.max_flavors,
    disponivel: api.is_available,
  };
}

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: (data) => data.map(toProduct),
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; price: number; category: ItemCategory; max_flavors?: number; is_available: boolean }) =>
      createProduct(data),
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      updateProduct(id, { is_available }),
    // Optimistic update for fast toggling
    onMutate: async ({ id, is_available }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<ApiProduct[]>(['products']);
      queryClient.setQueryData<ApiProduct[]>(['products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, is_available } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous);
    },
    onSettled: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addProduct: (nome: string, preco: number, categoria: ItemCategory, maxSabores: number, disponivel: boolean) =>
      addMutation.mutateAsync({
        name: nome,
        price: preco,
        category: categoria,
        max_flavors: categoria === 'tamanho' ? maxSabores : 0,
        is_available: disponivel,
      }),
    toggleAvailability: (id: string, disponivel: boolean) =>
      toggleMutation.mutate({ id, is_available: disponivel }),
    removeProduct: (id: string) => removeMutation.mutateAsync(id),
    isSaving: addMutation.isPending || removeMutation.isPending,
  };
}
