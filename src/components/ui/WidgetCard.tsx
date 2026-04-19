import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface WidgetCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  children?: React.ReactNode;
  className?: string;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title, value, subtitle, icon: Icon, trend, children, className
}) => {
  return (
    <div className={cn("glass-panel flex flex-col p-5 shadow-lg border-t border-t-white/5", className)}>
      <div className="flex items-start justify-between">
        <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-surface-hover/50 border border-border flex items-center justify-center -mt-1 -mr-1">
            <Icon className="w-4 h-4 text-zinc-500" />
          </div>
        )}
      </div>
      
      {value !== undefined && (
        <div className="mt-3 flex items-baseline gap-3">
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center",
              trend.isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      )}
      
      {subtitle && <p className="text-xs text-zinc-500 mt-2">{subtitle}</p>}
      
      {children && <div className="mt-4 flex-1">{children}</div>}
    </div>
  );
};
