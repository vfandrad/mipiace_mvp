/**
 * Hook para CRUD de produtos via API
 * Usa React Query para cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  ApiProduct,
  ativarInativarProduct,
  updateProduct,
  fetchProduct,
} from "@/lib/api";
import { toast } from "sonner";

export interface Product {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
}

// Converte API (inglês) → frontend (português)
function toProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    nome: api.name,
    preco: api.price,
    disponivel: api.is_available,
  };
}

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["products"] });

  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    select: (data) => data.map(toProduct),
  });

  function useProductDetail(id: string) {
    return useQuery({
      queryKey: ["product-detail", id],
      queryFn: () => fetchProduct(id),
      enabled: !!id, // evita rodar com id undefined
    });
  }

  const addMutation = useMutation({
    mutationFn: (data: {
      name: string;
      price: number;
      is_available: boolean;
    }) => createProduct(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      data: {
        name: string;
        price: number;
        is_available: boolean;
      };
    }) => updateProduct(data.id, data.data),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });

  const ativarInativarMutation = useMutation({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      ativarInativarProduct(id, { is_available }),
    onSuccess: invalidate,
  });

  return {
    products: query.data ?? [],
    useProductDetail,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error,
    addProduct: (nome: string, preco: number, disponivel: boolean) =>
      addMutation.mutateAsync({
        name: nome,
        price: preco,
        is_available: disponivel,
      }),
    updateProduct: (
      id: string,
      nome: string,
      preco: number,
      disponivel: boolean,
    ) =>
      updateMutation.mutateAsync({
        id,
        data: {
          name: nome,
          price: preco,
          is_available: disponivel,
        },
      }),
    removeProduct: (id: string) => removeMutation.mutateAsync(id),
    ativarInativarProduct: (id: string, is_available: boolean) =>
      ativarInativarMutation.mutateAsync({ id, is_available }),
    isSaving:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      ativarInativarMutation.isPending,
  };
}
