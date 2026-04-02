/**
 * Serviço de comunicação com a API backend (api.vfandrade.com)
 * Centraliza todas as chamadas HTTP do projeto
 */

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
// Pedidos (Orders)
// ========================================

export interface ApiOrderItem {
  id: string;
  name: string;
  quantity: number;
  flavors: string[];
  accompaniments?: string[];
  price: number;
}

export interface ApiOrder {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  items: ApiOrderItem[];
  total: number;
  customer_name?: string;
  created_at: string;
  updated_at: string;
}

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
// Produtos (Products)
// ========================================

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export function fetchProducts(): Promise<ApiProduct[]> {
  return request<ApiProduct[]>('/products/');
}

export function createProduct(data: { name: string; price: number; is_available: boolean }): Promise<ApiProduct> {
  return request<ApiProduct>('/products/', { method: 'POST', body: JSON.stringify(data) });
}

export function deleteProduct(id: string): Promise<void> {
  return request<void>(`/products/${id}`, { method: 'DELETE' });
}
