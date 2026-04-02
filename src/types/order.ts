/**
 * Tipos relacionados a pedidos da gelateria
 * Esses tipos são usados em todo o sistema para tipagem de dados
 */

// Status possíveis de um pedido no fluxo de produção
export type OrderStatus = 'novo' | 'producao' | 'pronto' | 'entregue';

// Status de pagamento do pedido
export type PaymentStatus = 'pago' | 'pendente';

// Item individual dentro de um pedido
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  flavors: string[];
  accompaniments?: string[];
  price: number;
}

// Pedido completo
export interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  total: number;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// Tipos para Dashboard e Gráficos
// ========================================

// Dados para cards de KPI (indicadores chave)
export interface KPIData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

// Dados de vendas diárias (para gráfico de linha)
export interface SalesData {
  date: string;
  total: number;
  orders: number;
}

// Dados de vendas por produto (para gráfico de barras)
export interface ProductSalesData {
  name: string;
  sales: number;
  revenue: number;
}

// Dados de vendas por horário (para gráfico de área)
export interface HourlySalesData {
  hour: string;
  orders: number;
  revenue: number;
}
