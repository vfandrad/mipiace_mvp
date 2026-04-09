/**
 * Hook para CRUD de produtos via API FastAPI
 * A API já retorna a árvore completa: Produtos > Grupos > Complementos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, deleteProduct } from '@/lib/api';
import { Product } from '@/types/order';

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
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
    addProduct: (name: string, price: number, is_available: boolean) =>
      addMutation.mutateAsync({ name, price, is_available }),
    removeProduct: (id: string) => removeMutation.mutateAsync(id),
    isSaving: addMutation.isPending || removeMutation.isPending,
  };
}
