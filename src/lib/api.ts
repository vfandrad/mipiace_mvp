/**
 * Serviço centralizado de comunicação com a API FastAPI
 * Todas as chamadas HTTP do projeto passam por aqui
 */

import { Order, OrderStatus, Product } from '@/types/order';

const BASE_URL = 'https://api.vfandrade.com';

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

/** GET /orders — retorna pedidos com itens detalhados e endereço */
export function fetchOrders(): Promise<Order[]> {
  return request<Order[]>('/orders/');
}

/** PATCH /orders/{id} — atualiza status do pedido */
export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return request<Order>(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ========================================
// Produtos (Products) — árvore completa
// ========================================

/** GET /products — retorna inventário completo (Produtos > Grupos > Complementos) */
export function fetchProducts(): Promise<Product[]> {
  return request<Product[]>('/products/');
}

/** POST /products — cria novo produto */
export function createProduct(data: { name: string; price: number; is_available: boolean }): Promise<Product> {
  return request<Product>('/products/', { method: 'POST', body: JSON.stringify(data) });
}

/** DELETE /products/{id} — remove produto */
export function deleteProduct(id: string): Promise<void> {
  return request<void>(`/products/${id}`, { method: 'DELETE' });
}
