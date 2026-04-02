/**
 * Gráfico de barras horizontais — produtos mais vendidos (responsivo)
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductSalesData } from '@/types/order';

interface ProductsChartProps {
  data: ProductSalesData[];
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <div className="kpi-card">
      <h3 className="font-semibold mb-4 text-sm sm:text-base">Produtos Mais Vendidos</h3>
      <div className="h-[200px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Vendas']}
            />
            <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
