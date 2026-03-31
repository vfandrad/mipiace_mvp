export interface Product {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: {
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  status: 'novo' | 'em_producao' | 'pronto' | 'entregue';
  payment_status: 'pendente' | 'pago';
  created_at: string;
  order_items?: OrderItem[];
}