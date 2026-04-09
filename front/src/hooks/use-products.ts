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

export interface Product {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
}

export function useProducts() {
  const queryClient = useQueryClient();

  function refetch() {
    queryClient.refetchQueries({ queryKey: ["products"], type: "all" });
  }

  function ProductsQuery() {
    return useQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
    });
  }

  function ProductDetailQuery(id: string) {
    return useQuery({
      queryKey: ["product-detail", id],
      queryFn: () => fetchProduct(id),
      enabled: !!id, // evita rodar com id undefined
    });
  }

  function AddProductMutation() {
    return useMutation<
      ApiProduct,
      void,
      {
        nome: string;
        preco: number;
        disponivel: boolean;
      }
    >({
      mutationFn: (data) =>
        createProduct({
          name: data.nome,
          price: data.preco,
          is_available: data.disponivel,
        }),
      onSuccess: refetch,
    });
  }

  function UpdateProductMutation() {
    return useMutation<void, void, Product>({
      mutationFn: (data) =>
        updateProduct(data.id, {
          name: data.nome,
          price: data.preco,
          is_available: data.disponivel,
        }),
      onSuccess: refetch,
    });
  }

  function RemoveProductMutation() {
    return useMutation({
      mutationFn: (id: string) => deleteProduct(id),
      onSuccess: refetch,
    });
  }

  function AtivarInativarMutation() {
    return useMutation<
      void,
      void,
      {
        id: string;
        is_available: boolean;
      }
    >({
      mutationFn: (data) => {
        return ativarInativarProduct(data.id, data.is_available);
      },
      onSuccess: refetch,
    });
  }

  return {
    ProductsQuery,
    ProductDetailQuery,
    refetch,
    AddProductMutation,
    UpdateProductMutation,
    RemoveProductMutation,
    AtivarInativarMutation,
  };
}
