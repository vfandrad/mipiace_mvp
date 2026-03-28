/**
 * Filtro de período para o dashboard
 * Permite selecionar hoje, semana, mês ou data personalizada
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Period = 'today' | 'week' | 'month' | 'custom';

interface DateFilterProps {
  onPeriodChange?: (period: Period) => void;
}

// Opções de período rápido
const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
];

export function DateFilter({ onPeriodChange }: DateFilterProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Botões de período rápido */}
      <div className="flex items-center bg-secondary rounded-lg p-1">
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => handlePeriodChange(option.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              period === option.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

    </div>
  );
}
