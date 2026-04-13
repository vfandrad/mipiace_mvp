/** Card de KPI — exibe métrica com variação percentual */

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function KPICard({ title, value, change, changeLabel, icon, className, valuePrefix = '', valueSuffix = '' }: KPICardProps) {
  const isPositive = change != null && change > 0;
  const isNegative = change != null && change < 0;

  return (
    <div className={cn('kpi-card animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-xl sm:text-3xl font-semibold tracking-tight">
            {valuePrefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{valueSuffix}
          </p>
        </div>
        {icon && <div className="p-2 rounded-lg bg-secondary shrink-0 hidden sm:block">{icon}</div>}
      </div>

      {change != null && (
        <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
          <div className={cn(
            'flex items-center gap-1 text-xs sm:text-sm font-medium',
            isPositive && 'text-status-ready',
            isNegative && 'text-destructive',
            !isPositive && !isNegative && 'text-muted-foreground'
          )}>
            {isPositive && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />}
            {isNegative && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
            <span>{isPositive && '+'}{change.toFixed(1)}%</span>
          </div>
          {changeLabel && <span className="text-xs text-muted-foreground hidden sm:inline">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
