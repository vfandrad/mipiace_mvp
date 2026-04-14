/**
 * Hook para inventário: CRUD completo
 * Implementa hierarquia PDV: Produto > Grupo (is_required) > Complementos
 * Contém atualizações otimistas para deleção em cascata e toggle de disponibilidade.
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

  // 1. Busca dos dados
  const query = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  const data: InventoryResponse = query.data ?? { products: [], groups: [], complements: [] };

  // Mapa otimizado para o Kanban resolver os nomes dos complementos
  const complementMap = new Map<string, ApiComplement>();
  for (const c of data.complements) {
    complementMap.set(c.id, c);
  }

  // 2. Toggle de Disponibilidade (PATCH Otimista)
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

  // 3. Edição Genérica
  const editMutation = useMutation({
    mutationFn: ({ type, id, data }: { type: 'product' | 'complement'; id: string; data: Record<string, unknown> }) =>
      patchInventoryItem(type, id, data as any),
    onSuccess: () => { toast.success('Item atualizado com sucesso!'); invalidate(); },
    onError: () => toast.error('Erro ao atualizar o item.'),
  });

  // 4. Criação de Produto
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { toast.success('Produto criado com sucesso!'); invalidate(); },
    onError: () => toast.error('Erro ao criar o produto.'),
  });

  // 5. Criação de Grupo/Categoria (AQUI ESTÁ A CORREÇÃO DO IS_REQUIRED)
  const createGroupMutation = useMutation({
    mutationFn: (newGroupData: { 
      name: string; 
      min_choices: number; 
      max_choices: number; 
      is_required: boolean; // <-- Campo crucial adicionado
      product_id: string 
    }) => createComplementGroup(newGroupData),
    onSuccess: () => { toast.success('Categoria criada com sucesso!'); invalidate(); },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
      toast.error('Erro ao criar categoria. Verifique os dados enviados.');
    },
  });

  // 6. Criação de Complemento
  const createComplementMutation = useMutation({
    mutationFn: createComplement,
    onSuccess: () => { toast.success('Complemento criado com sucesso!'); invalidate(); },
    onError: () => toast.error('Erro ao criar o complemento.'),
  });

  // 7. Exclusão em Cascata (Otimista)
  const deleteItemMutation = useMutation({
    mutationFn: ({ type, id }: { type: 'product' | 'complement' | 'complement_group'; id: string }) =>
      deleteInventoryItem(type, id),
    onMutate: async ({ type, id }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const prev = queryClient.getQueryData<InventoryResponse>(['inventory']);
      
      queryClient.setQueryData<InventoryResponse>(['inventory'], (old) => {
        if (!old) return old;
        
        if (type === 'product') {
          // Cascata visual: remove o produto + grupos dele + complementos dos grupos
          const groupIds = old.groups.filter(g => g.product_id === id).map(g => g.id);
          return {
            ...old,
            products: old.products.filter(p => p.id !== id),
            groups: old.groups.filter(g => g.product_id !== id),
            complements: old.complements.filter(c => !groupIds.includes(c.group_id)),
          };
        }
        
        if (type === 'complement_group') {
          // Cascata visual: remove o grupo + complementos atrelados a ele
          return {
            ...old,
            groups: old.groups.filter(g => g.id !== id),
            complements: old.complements.filter(c => c.group_id !== id),
          };
        }
        
        // Remove apenas um complemento isolado
        return { ...old, complements: old.complements.filter(c => c.id !== id) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Se a exclusão falhar no backend, restaura o item na tela
      if (ctx?.prev) queryClient.setQueryData(['inventory'], ctx.prev);
      toast.error('Erro ao excluir. O servidor rejeitou a ação.');
    },
    onSuccess: () => toast.success('Item excluído com sucesso!'),
    onSettled: invalidate, // Sempre força um re-fetch para garantir integridade com o banco
  });

  return {
    products: data.products,
    groups: data.groups,
    complements: data.complements,
    complementMap,
    isLoading: query.isLoading,
    error: query.error,
    
    // Funções exportadas
    toggleAvailability: (type: 'product' | 'complement', id: string, is_available: boolean) =>
      toggleMutation.mutate({ type, id, is_available }),
      
    editItem: (type: 'product' | 'complement', id: string, data: Record<string, unknown>) =>
      editMutation.mutateAsync({ type, id, data }),
      
    createProduct: (data: { name: string; base_price: number; is_available: boolean }) =>
      createProductMutation.mutateAsync(data),
      
    createGroup: (data: { name: string; min_choices: number; max_choices: number; is_required: boolean; product_id: string }) =>
      createGroupMutation.mutateAsync(data), // <-- Agora repassa is_required
      
    createComplement: (data: { name: string; extra_price: number; group_id: string; is_available: boolean }) =>
      createComplementMutation.mutateAsync(data),
      
    deleteItem: (type: 'product' | 'complement' | 'complement_group', id: string) =>
      deleteItemMutation.mutate({ type, id }),
      
    isSaving: toggleMutation.isPending || editMutation.isPending || deleteItemMutation.isPending,
  };
}