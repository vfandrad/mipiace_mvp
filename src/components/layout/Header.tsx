/**
 * Header principal da aplicação
 * Navegação com indicador deslizante animado (estilo Stripe/Apple)
 */

import { useLayoutEffect, useCallback, useRef, useState } from 'react';
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
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex(item => item.path === location.pathname);

  const updateIndicator = useCallback(() => {
    if (activeIndex === -1 || !navRef.current) {
      setIndicatorStyle(null);
      return;
    }
    const activeBtn = itemRefs.current[activeIndex];
    if (activeBtn) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [activeIndex]);

  // Recalcula posição do indicador quando muda a rota ou o layout
  useLayoutEffect(() => {
    updateIndicator();

    // Observa mudanças de tamanho (ex: breakpoint mobile/desktop)
    const observer = new ResizeObserver(updateIndicator);
    if (navRef.current) observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [updateIndicator]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoMiPiace}
            alt="Mi Piace Gelato"
            className={cn('h-10 object-contain transition-opacity duration-300', logoLoaded ? 'opacity-100' : 'opacity-0')}
            onLoad={() => setLogoLoaded(true)}
            loading="eager"
            decoding="async"
          />
        </Link>

        <nav ref={navRef} className="relative flex items-center bg-secondary rounded-lg p-1">
          {/* Indicador deslizante */}
          {indicatorStyle && (
            <div
              className="absolute top-1 bottom-1 rounded-md bg-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          )}

          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                ref={(el) => { itemRefs.current[i] = el; }}
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
