/**
 * Gráfico de barras horizontais mostrando produtos mais vendidos
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductSalesData } from '@/types/order';

interface ProductsChartProps {
  data: ProductSalesData[];
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <div className="kpi-card">
      <h3 className="font-semibold mb-4">Produtos Mais Vendidos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis 
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => [value, name === 'sales' ? 'Vendas' : 'Receita']}
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(var(--chart-2))" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
