/**
 * Header principal da aplicação
 * Navegação com indicador deslizante animado (estilo Stripe/Apple)
 */

import { useEffect, useRef, useState } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Calcula posição do indicador deslizante
  useEffect(() => {
    if (!navRef.current) return;
    const activeIndex = NAV_ITEMS.findIndex(item => item.path === location.pathname);
    if (activeIndex === -1) {
      setIndicatorStyle({ left: 0, width: 0 });
      return;
    }
    const buttons = navRef.current.querySelectorAll<HTMLAnchorElement>('[data-nav-item]');
    const activeBtn = buttons[activeIndex];
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [location.pathname]);

  const isNavActive = NAV_ITEMS.some(item => item.path === location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoMiPiace} alt="Mi Piace Gelato" className="h-10 object-contain" />
        </Link>

        <nav ref={navRef} className="relative flex items-center gap-1 bg-secondary rounded-lg p-1">
          {/* Indicador deslizante */}
          {isNavActive && (
            <div
              className="absolute top-1 bottom-1 rounded-md bg-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                data-nav-item
                className={cn(
                  'relative z-10 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="w-10" />
      </div>
    </header>
  );
}
