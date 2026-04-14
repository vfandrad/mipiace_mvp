/**
 * Serviço de comunicação com a API backend (api.vfandrade.com)
 * Centraliza todas as chamadas HTTP do projeto
 */

import { InventoryResponse, ApiOrder, ApiProduct } from '@/types/order';

const BASE_URL = 'https://api.vfandrade.com';

// Helper genérico para fetch com tratamento de erro
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

// ========================================
// Pedidos
// ========================================

export function fetchOrders(): Promise<ApiOrder[]> {
  return request<ApiOrder[]>('/orders/');
}

export function updateOrderStatus(id: string, status: string): Promise<ApiOrder> {
  return request<ApiOrder>(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ========================================
// Inventário (Produtos + Grupos + Complementos)
// ========================================

export function fetchInventory(): Promise<InventoryResponse> {
  return request<InventoryResponse>('/products/');
}

/**
 * Atualiza disponibilidade ou preço de um produto/complemento
 * type: 'product' | 'complement'
 */
export function patchInventoryItem(
  type: 'product' | 'complement',
  id: string,
  data: Partial<{ is_available: boolean; base_price: number; extra_price: number; name: string }>
): Promise<unknown> {
  return request(`/products/${type}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// POST novo produto
export function createProduct(data: { name: string; base_price: number; is_available: boolean }): Promise<ApiProduct> {
  return request<ApiProduct>('/products/product', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// POST novo grupo de complementos
export function createComplementGroup(data: { name: string; min_choices: number; max_choices: number; is_required: boolean; product_id: string }): Promise<unknown> {
  return request('/products/complement_group', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// POST novo complemento
export function createComplement(data: { name: string; extra_price: number; group_id: string; is_available: boolean }): Promise<unknown> {
  return request('/products/complement', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// DELETE produto ou complemento
export function deleteInventoryItem(type: 'product' | 'complement' | 'complement_group', id: string): Promise<unknown> {
  return request(`/products/${type}/${id}`, { method: 'DELETE' });
}
