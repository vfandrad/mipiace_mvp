/** Hook de inventário — CRUD completo via API */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchInventory, patchInventoryItem,
  createProduct, createComplementGroup, createComplement,
  deleteInventoryItem, deleteComplementGroup,
} from '@/lib/api';
import { InventoryResponse, ApiComplement } from '@/types/order';
import { toast } from 'sonner';

export function useProducts() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['inventory'] });

  const query = useQuery({ queryKey: ['inventory'], queryFn: fetchInventory });
  const data: InventoryResponse = query.data ?? { products: [], groups: [], complements: [] };

  // Mapa de complementos para resolver IDs no Kanban
  const complementMap = new Map<string, ApiComplement>();
  for (const c of data.complements) complementMap.set(c.id, c);

  // --- Mutations ---

  const toggleMutation = useMutation({
    mutationFn: ({ type, id, is_available }: { type: 'product' | 'complement'; id: string; is_available: boolean }) =>
      patchInventoryItem(type, id, { is_available }),
    // Optimistic UI: atualiza antes da resposta do servidor
    onMutate: async ({ type, id, is_available }) => {
      await qc.cancelQueries({ queryKey: ['inventory'] });
      const prev = qc.getQueryData<InventoryResponse>(['inventory']);
      qc.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        if (type === 'product') return { ...old, products: old.products.map(p => p.id === id ? { ...p, is_available } : p) };
        return { ...old, complements: old.complements.map(c => c.id === id ? { ...c, is_available } : c) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao atualizar disponibilidade');
    },
    onSettled: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: ({ type, id, data }: { type: 'product' | 'complement'; id: string; data: Record<string, unknown> }) =>
      patchInventoryItem(type, id, data as any),
    onSuccess: () => { toast.success('Item atualizado!'); invalidate(); },
    onError: () => toast.error('Erro ao atualizar item'),
  });

  const createProductMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { toast.success('Produto criado!'); invalidate(); },
    onError: () => toast.error('Erro ao criar produto'),
  });

  const createGroupMut = useMutation({
    mutationFn: createComplementGroup,
    onSuccess: () => { toast.success('Categoria criada!'); invalidate(); },
    onError: () => toast.error('Erro ao criar categoria'),
  });

  const createComplementMut = useMutation({
    mutationFn: createComplement,
    onSuccess: () => { toast.success('Complemento criado!'); invalidate(); },
    onError: () => toast.error('Erro ao criar complemento'),
  });

  const deleteItemMut = useMutation({
    mutationFn: ({ type, id }: { type: 'product' | 'complement'; id: string }) => deleteInventoryItem(type, id),
    // Optimistic: remove da lista imediatamente
    onMutate: async ({ type, id }) => {
      await qc.cancelQueries({ queryKey: ['inventory'] });
      const prev = qc.getQueryData<InventoryResponse>(['inventory']);
      qc.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        if (type === 'product') return { ...old, products: old.products.filter(p => p.id !== id) };
        return { ...old, complements: old.complements.filter(c => c.id !== id) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao excluir item');
    },
    onSuccess: () => toast.success('Item excluído!'),
    onSettled: invalidate,
  });

  const deleteGroupMut = useMutation({
    mutationFn: (id: string) => deleteComplementGroup(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['inventory'] });
      const prev = qc.getQueryData<InventoryResponse>(['inventory']);
      qc.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        return { ...old, groups: old.groups.filter(g => g.id !== id), complements: old.complements.filter(c => c.group_id !== id) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao excluir categoria');
    },
    onSuccess: () => toast.success('Categoria excluída!'),
    onSettled: invalidate,
  });

  return {
    products: data.products,
    groups: data.groups,
    complements: data.complements,
    complementMap,
    isLoading: query.isLoading,
    error: query.error,
    isSaving: toggleMutation.isPending || editMutation.isPending || deleteItemMut.isPending,
    toggleAvailability: (type: 'product' | 'complement', id: string, is_available: boolean) =>
      toggleMutation.mutate({ type, id, is_available }),
    editItem: (type: 'product' | 'complement', id: string, data: Record<string, unknown>) =>
      editMutation.mutateAsync({ type, id, data }),
    createProduct: (data: { name: string; base_price: number; is_available: boolean }) =>
      createProductMut.mutateAsync(data),
    createGroup: (data: { name: string; min_choices: number; max_choices: number }) =>
      createGroupMut.mutateAsync(data),
    createComplement: (data: { name: string; extra_price: number; group_id: string; is_available: boolean }) =>
      createComplementMut.mutateAsync(data),
    deleteItem: (type: 'product' | 'complement', id: string) =>
      deleteItemMut.mutate({ type, id }),
    deleteGroup: (id: string) => deleteGroupMut.mutate(id),
  };
}
