/**
 * Tipos do sistema Mi Piace
 * Refletem os contratos reais da API (api.vfandrade.com)
 */

// ========================================
// Pedidos
// ========================================

export type OrderStatus = 'novo' | 'preparando' | 'entrega' | 'finalizado';
export type PaymentStatus = 'pago' | 'pendente';

/** Item de pedido como vem da API */
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  details?: string;
  complement_ids: string[];
  products: { name: string };
}

/** Pedido como vem da API */
export interface ApiOrder {
  id: string;
  customer_name: string;
  customer_phone?: string;
  total_price: number;
  rua: string;
  numero: string;
  bairro: string;
  complemento_endereco?: string | null;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

/** Pedido normalizado para o frontend */
export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  totalPrice: number;
  address: {
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string | null;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  items: OrderItem[];
}

// ========================================
// Inventário (Produtos + Grupos + Complementos)
// ========================================

export interface ApiProduct {
  id: string;
  name: string;
  base_price: number;
  is_available: boolean;
}

export interface ApiGroup {
  id: string;
  name: string;
  min_choices: number;
  max_choices: number;
  is_required: boolean;
}

export interface ApiComplement {
  id: string;
  group_id: string;
  name: string;
  extra_price: number;
  is_available: boolean;
}

/** Resposta completa de GET /products/ */
export interface InventoryResponse {
  products: ApiProduct[];
  groups: ApiGroup[];
  complements: ApiComplement[];
}

// ========================================
// Dashboard (mock — sem endpoint de métricas)
// ========================================

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
