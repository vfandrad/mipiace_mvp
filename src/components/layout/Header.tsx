/**
 * Header principal da aplicação
 * Navegação: Produção e Produtos (Dashboard só via URL)
 * Transição fluida estilo Stripe/Apple no indicador ativo
 */

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
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
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Calcula posição do indicador ativo
  const updateIndicator = () => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  };

  useLayoutEffect(updateIndicator, [location.pathname]);
  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className={cn('h-10 w-10 flex items-center justify-center', !logoLoaded && 'bg-muted rounded-lg animate-pulse')}>
            <img
              src={logoMiPiace}
              alt="Mi Piace Gelato"
              className={cn('h-10 object-contain transition-opacity duration-300', logoLoaded ? 'opacity-100' : 'opacity-0')}
              onLoad={() => setLogoLoaded(true)}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </Link>

        <nav ref={navRef} className="relative flex items-center gap-1">
          {/* Indicador animado */}
          <div
            className="absolute top-0 bottom-0 rounded-lg bg-primary transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.width ? 1 : 0 }}
          />

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-active={isActive}
                className={cn(
                  'relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
