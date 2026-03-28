/**
 * Header principal da aplicação
 * Navegação: Produção e Produtos (Dashboard só via URL)
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Store, Package } from 'lucide-react';
import logoMiPiace from '@/assets/logo-mipiace.png';

const NAV_ITEMS = [
  { path: '/loja', label: 'Produção', icon: Store },
  { path: '/produtos', label: 'Produtos', icon: Package },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoMiPiace} alt="Mi Piace Gelato" className="h-10 object-contain" />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Espaço reservado para futuro botão de perfil/logout */}
        <div className="w-10" />
      </div>
    </header>
  );
}
