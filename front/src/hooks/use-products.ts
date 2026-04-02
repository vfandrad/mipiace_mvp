/**
 * Hook para CRUD de produtos via API
 * Usa React Query para cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, deleteProduct, ApiProduct } from '@/lib/api';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
}

// Converte API (inglês) → frontend (português)
function toProduct(api: ApiProduct): Product {
  return { id: api.id, nome: api.name, preco: api.price, disponivel: api.is_available };
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
    mutationFn: (data: { name: string; price: number; is_available: boolean }) => createProduct(data),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addProduct: (nome: string, preco: number, disponivel: boolean) =>
      addMutation.mutateAsync({ name: nome, price: preco, is_available: disponivel }),
    removeProduct: (id: string) => removeMutation.mutateAsync(id),
    isSaving: addMutation.isPending || removeMutation.isPending,
  };
}
