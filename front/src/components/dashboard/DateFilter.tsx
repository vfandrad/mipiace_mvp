/**
 * Filtro de período para o dashboard
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PERIODS = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
] as const;

type Period = typeof PERIODS[number]['value'];

interface DateFilterProps {
  onPeriodChange?: (period: Period) => void;
}

export function DateFilter({ onPeriodChange }: DateFilterProps) {
  const [period, setPeriod] = useState<Period>('week');

  const handleChange = (p: Period) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

  return (
    <div className="flex items-center bg-secondary rounded-lg p-1">
      {PERIODS.map(opt => (
        <Button
          key={opt.value}
          variant="ghost"
          size="sm"
          onClick={() => handleChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            period === opt.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
