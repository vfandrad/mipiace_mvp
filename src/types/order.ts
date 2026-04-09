/**
 * Tipos do sistema — pedidos e produtos
 * Reflete a estrutura exata da API FastAPI
 */

// ========================================
// Pedidos (Orders)
// ========================================

export type OrderStatus = 'novo' | 'preparando' | 'entrega' | 'finalizado';
export type PaymentStatus = 'pago' | 'pendente';

export interface OrderItemDetalhado {
  produto: string;
  quantidade: number;
  escolhas: string[];
  observacoes?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  rua: string;
  numero: string;
  bairro: string;
  status: OrderStatus;
  payment_status?: PaymentStatus;
  itens_detalhados: OrderItemDetalhado[];
  created_at?: string;
}

// ========================================
// Produtos (Products) — Árvore hierárquica
// ========================================

export interface Complement {
  id: string;
  name: string;
  extra_price: number;
  is_available: boolean;
}

export interface ComplementGroup {
  id: string;
  name: string;
  complements: Complement[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  complement_groups?: ComplementGroup[];
}

// ========================================
// Dashboard (mantido para compatibilidade)
// ========================================

export interface KPIData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface SalesData {
  date: string;
  total: number;
  orders: number;
}

export interface ProductSalesData {
  name: string;
  sales: number;
  revenue: number;
}

export interface HourlySalesData {
  hour: string;
  orders: number;
  revenue: number;
}
