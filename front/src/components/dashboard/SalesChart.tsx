/**
 * Gráfico de linha mostrando vendas da semana
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesData } from '@/types/order';

interface SalesChartProps {
  data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
  // Formata as datas para exibição (ex: "seg 20")
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
  }));

  return (
    <div className="kpi-card">
      <h3 className="font-semibold mb-4">Vendas da Semana</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Total']}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-1))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
