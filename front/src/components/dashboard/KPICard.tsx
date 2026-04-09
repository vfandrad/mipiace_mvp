/**
 * Card de KPI (Indicador Chave de Performance)
 * Exibe uma métrica importante com variação percentual
 */

import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  LucideProps,
  IconNode,
  LucideIcon,
} from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // Variação percentual (positivo ou negativo)
  changeLabel?: string; // Ex: "vs ontem", "vs semana passada"
  icon?: LucideIcon;
  className?: string;
  valuePrefix?: string; // Ex: "R$ "
  valueSuffix?: string; // Ex: "%"
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  valuePrefix = "",
  valueSuffix = "",
}: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn("kpi-card animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight">
            {valuePrefix}
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
            {valueSuffix}
          </p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-secondary">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Indicador de variação */}
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive && "text-status-ready",
              isNegative && "text-destructive",
              !isPositive && !isNegative && "text-muted-foreground",
            )}
          >
            {isPositive && <TrendingUp className="h-4 w-4" />}
            {isNegative && <TrendingDown className="h-4 w-4" />}
            <span>
              {isPositive && "+"}
              {change.toFixed(1)}%
            </span>
          </div>
          {changeLabel && (
            <span className="text-sm text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
