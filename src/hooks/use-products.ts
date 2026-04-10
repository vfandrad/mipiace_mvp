/**
 * Hook para CRUD de produtos via API + categorias locais
 * Usa React Query para cache e mutations
 * Categorias são gerenciadas via localStorage (API não suporta)
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, deleteProduct, ApiProduct } from '@/lib/api';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
  categoria: string;
}

const CATEGORIES_KEY = 'mi-piace-categories';
const PRODUCT_CATEGORIES_KEY = 'mi-piace-product-categories';
const AVAILABILITY_OVERRIDES_KEY = 'mi-piace-availability-overrides';

function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCategories(cats: string[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

function loadProductCategories(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PRODUCT_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProductCategories(map: Record<string, string>) {
  localStorage.setItem(PRODUCT_CATEGORIES_KEY, JSON.stringify(map));
}

function loadAvailabilityOverrides(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(AVAILABILITY_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAvailabilityOverrides(map: Record<string, boolean>) {
  localStorage.setItem(AVAILABILITY_OVERRIDES_KEY, JSON.stringify(map));
}

function toProduct(api: ApiProduct, categoryMap: Record<string, string>, availOverrides: Record<string, boolean>): Product {
  return {
    id: api.id,
    nome: api.name,
    preco: api.price ?? 0,
    disponivel: availOverrides[api.id] !== undefined ? availOverrides[api.id] : api.is_available,
    categoria: categoryMap[api.id] || 'Sem categoria',
  };
}

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const [categories, setCategories] = useState<string[]>(loadCategories);
  const [productCategories, setProductCategories] = useState<Record<string, string>>(loadProductCategories);
  const [availOverrides, setAvailOverrides] = useState<Record<string, boolean>>(loadAvailabilityOverrides);

  useEffect(() => { saveCategories(categories); }, [categories]);
  useEffect(() => { saveProductCategories(productCategories); }, [productCategories]);
  useEffect(() => { saveAvailabilityOverrides(availOverrides); }, [availOverrides]);

  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: (data) => data.map(p => toProduct(p, productCategories, availOverrides)),
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; price: number; is_available: boolean }) => createProduct(data),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_, id) => {
      setProductCategories(prev => { const next = { ...prev }; delete next[id]; return next; });
      setAvailOverrides(prev => { const next = { ...prev }; delete next[id]; return next; });
      invalidate();
    },
  });

  const addCategory = useCallback((name: string) => {
    setCategories(prev => prev.includes(name) ? prev : [...prev, name]);
  }, []);

  const removeCategory = useCallback((name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
    setProductCategories(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === name) delete next[k]; });
      return next;
    });
  }, []);

  const toggleAvailability = useCallback((id: string, available: boolean) => {
    setAvailOverrides(prev => {
      const next = { ...prev, [id]: available };
      saveAvailabilityOverrides(next);
      return next;
    });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    categories,
    addCategory,
    removeCategory,
    addProduct: async (nome: string, preco: number, disponivel: boolean, categoria: string) => {
      const result = await addMutation.mutateAsync({ name: nome, price: preco, is_available: disponivel });
      if (categoria && categoria !== 'Sem categoria') {
        setProductCategories(prev => ({ ...prev, [result.id]: categoria }));
      }
      return result;
    },
    removeProduct: (id: string) => removeMutation.mutateAsync(id),
    toggleAvailability,
    isSaving: addMutation.isPending || removeMutation.isPending,
  };
}
