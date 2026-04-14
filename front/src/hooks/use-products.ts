/**
 * Hook para inventário: CRUD completo
 * Grupos agora são vinculados a produtos (product_id) com deleção em cascata
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchInventory,
  patchInventoryItem,
  createProduct,
  createComplementGroup,
  createComplement,
  deleteInventoryItem,
} from '@/lib/api';
import { InventoryResponse, ApiComplement } from '@/types/order';
import { toast } from 'sonner';

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['inventory'] });

  const query = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  const data: InventoryResponse = query.data ?? { products: [], groups: [], complements: [] };

  const complementMap = new Map<string, ApiComplement>();
  for (const c of data.complements) {
    complementMap.set(c.id, c);
  }

  // Toggle disponibilidade
  const toggleMutation = useMutation({
    mutationFn: ({ type, id, is_available }: { type: 'product' | 'complement'; id: string; is_available: boolean }) =>
      patchInventoryItem(type, id, { is_available }),
    onMutate: async ({ type, id, is_available }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const prev = queryClient.getQueryData<InventoryResponse>(['inventory']);
      queryClient.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        if (type === 'product') {
          return { ...old, products: old.products.map(p => p.id === id ? { ...p, is_available } : p) };
        }
        return { ...old, complements: old.complements.map(c => c.id === id ? { ...c, is_available } : c) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao atualizar disponibilidade');
    },
    onSettled: invalidate,
  });

  // Editar item (PATCH)
  const editMutation = useMutation({
    mutationFn: ({ type, id, data }: { type: 'product' | 'complement'; id: string; data: Record<string, unknown> }) =>
      patchInventoryItem(type, id, data as any),
    onSuccess: () => { toast.success('Item atualizado!'); invalidate(); },
    onError: () => toast.error('Erro ao atualizar item'),
  });

  // Criar produto
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { toast.success('Produto criado!'); invalidate(); },
    onError: () => toast.error('Erro ao criar produto'),
  });

  // Dentro do useProducts, atualize a mutation:
  const createGroupMutation = useMutation({
    mutationFn: (data: { 
      name: string; 
      min_choices: number; 
      max_choices: number; 
      is_required: boolean; // Certifique-se de que este campo está aqui
      product_id: string 
    }) => createComplementGroup(data),
    onSuccess: () => { 
      toast.success('Categoria criada!'); 
      invalidate(); 
    },
    onError: (error) => {
      console.error("Erro na API:", error);
      toast.error('Erro ao criar categoria: verifique os campos obrigatórios');
    },
  });

  // Criar complemento
  const createComplementMutation = useMutation({
    mutationFn: createComplement,
    onSuccess: () => { toast.success('Complemento criado!'); invalidate(); },
    onError: () => toast.error('Erro ao criar complemento'),
  });

  // Deletar item (product, complement ou complement_group — cascata no banco)
  const deleteItemMutation = useMutation({
    mutationFn: ({ type, id }: { type: 'product' | 'complement' | 'complement_group'; id: string }) =>
      deleteInventoryItem(type, id),
    onMutate: async ({ type, id }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const prev = queryClient.getQueryData<InventoryResponse>(['inventory']);
      queryClient.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        if (type === 'product') {
          // Cascade: remove product + its groups + their complements
          const groupIds = old.groups.filter(g => g.product_id === id).map(g => g.id);
          return {
            ...old,
            products: old.products.filter(p => p.id !== id),
            groups: old.groups.filter(g => g.product_id !== id),
            complements: old.complements.filter(c => !groupIds.includes(c.group_id)),
          };
        }
        if (type === 'complement_group') {
          return {
            ...old,
            groups: old.groups.filter(g => g.id !== id),
            complements: old.complements.filter(c => c.group_id !== id),
          };
        }
        return { ...old, complements: old.complements.filter(c => c.id !== id) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao excluir item');
    },
    onSuccess: () => toast.success('Item excluído!'),
    onSettled: invalidate,
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
    editItem: (type: 'product' | 'complement', id: string, data: Record<string, unknown>) =>
      editMutation.mutateAsync({ type, id, data }),
    createProduct: (data: { name: string; base_price: number; is_available: boolean }) =>
      createProductMutation.mutateAsync(data),
    createGroup: (data: { name: string; min_choices: number; max_choices: number; product_id: string }) =>
      createGroupMutation.mutateAsync(data),
    createComplement: (data: { name: string; extra_price: number; group_id: string; is_available: boolean }) =>
      createComplementMutation.mutateAsync(data),
    deleteItem: (type: 'product' | 'complement' | 'complement_group', id: string) =>
      deleteItemMutation.mutate({ type, id }),
    isSaving: toggleMutation.isPending || editMutation.isPending || deleteItemMutation.isPending,
  };
}
