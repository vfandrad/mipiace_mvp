# 📖 Documentação do Projeto — Mi Piace Gelateria

Sistema de gestão interna para uma gelateria artesanal. Permite gerenciar pedidos em produção (Kanban), cadastrar produtos e visualizar métricas de desempenho (Dashboard).

---

## 🏗️ Arquitetura

```
src/
├── assets/                  # Imagens estáticas (logo)
├── components/
│   ├── dashboard/           # Componentes do painel administrativo
│   ├── layout/              # Header (navegação global)
│   ├── production/          # Componentes do quadro Kanban
│   └── ui/                  # Componentes base (shadcn/ui)
├── hooks/                   # Hooks customizados (toast, mobile)
├── lib/                     # Utilitários e dados mock
├── pages/                   # Páginas/rotas da aplicação
├── types/                   # Tipos TypeScript compartilhados
├── index.css                # Design tokens e estilos globais
└── main.tsx                 # Ponto de entrada da aplicação
```

---

## 📁 Arquivos — Explicação

### Raiz

| Arquivo | Descrição |
|---|---|
| `index.html` | HTML base. Define meta tags SEO, título e monta o React no `<div id="root">`. |
| `tailwind.config.ts` | Configura o Tailwind CSS: cores do design system, fontes, animações e sombras personalizadas. |
| `vite.config.ts` | Configuração do Vite (bundler): plugins React e alias de caminhos (`@/` → `src/`). |
| `tsconfig.app.json` | Configuração TypeScript para o código da aplicação. |

### `src/`

| Arquivo | Descrição |
|---|---|
| `main.tsx` | Renderiza o componente `<App />` no DOM. Importa estilos globais. |
| `App.tsx` | Configura rotas e providers globais (React Query, Tooltip, Toast). A rota `/` redireciona para `/loja`. |
| `index.css` | Define o design system completo: paleta de cores (CSS variables), estilos de componentes (badges, cards, kanban) e animações. |

### `src/pages/`

| Arquivo | Rota | Descrição |
|---|---|---|
| `Loja.tsx` | `/loja` | Quadro Kanban com 4 colunas (Novo → Produção → Pronto → Entregue). Permite mover pedidos entre status. |
| `Produtos.tsx` | `/produtos` | CRUD local de produtos: criar, editar, excluir. Dados em memória (mock). |
| `Admin.tsx` | `/admin` | Dashboard com KPIs (vendas, pedidos, ticket médio), gráficos de vendas/produtos/horário e lista de pedidos recentes. |
| `NotFound.tsx` | `/*` | Página 404 simples com link para voltar ao início. |

### `src/components/layout/`

| Arquivo | Descrição |
|---|---|
| `Header.tsx` | Navegação principal com logo e abas (Produção/Produtos). Possui indicador deslizante animado (estilo Stripe) que acompanha a aba ativa. |

### `src/components/production/`

| Arquivo | Descrição |
|---|---|
| `KanbanColumn.tsx` | Uma coluna do quadro Kanban. Exibe título, contagem e lista de cards de pedidos. |
| `OrderCard.tsx` | Card individual de pedido. Mostra número, cliente, itens, total e botão para avançar o status no fluxo. Destaca pedidos urgentes (>15 min). |

### `src/components/dashboard/`

| Arquivo | Descrição |
|---|---|
| `KPICard.tsx` | Card reutilizável para indicadores: exibe valor, ícone e variação percentual (positiva/negativa). |
| `SalesChart.tsx` | Gráfico de linha (Recharts) mostrando vendas diárias da semana. |
| `ProductsChart.tsx` | Gráfico de barras horizontais mostrando produtos mais vendidos. |
| `HourlyChart.tsx` | Gráfico de área mostrando distribuição de pedidos por horário. |
| `DateFilter.tsx` | Seletor de período (Hoje/Semana/Mês) para filtrar dados do dashboard. |
| `RecentOrders.tsx` | Tabela com os pedidos mais recentes: número, cliente, itens, total, status e pagamento. |

### `src/components/ui/`

Componentes base do **shadcn/ui**. Não devem ser editados diretamente — são primitivos visuais reutilizáveis.

| Arquivo | Descrição |
|---|---|
| `status-badge.tsx` | Badges personalizados para status de pedido (`StatusBadge`) e pagamento (`PaymentBadge`). |
| `button.tsx`, `input.tsx`, `label.tsx`, etc. | Componentes primitivos do shadcn/ui. |

### `src/types/`

| Arquivo | Descrição |
|---|---|
| `order.ts` | Todos os tipos TypeScript do projeto: `Order`, `OrderItem`, `OrderStatus`, `PaymentStatus`, `KPIData`, `SalesData`, `ProductSalesData`, `HourlySalesData`. |

### `src/lib/`

| Arquivo | Descrição |
|---|---|
| `utils.ts` | Função `cn()` para mesclar classes CSS (clsx + tailwind-merge). |
| `mock-data.ts` | Dados de exemplo para desenvolvimento: pedidos, vendas diárias, vendas por produto, vendas por horário e função `calculateKPIs()`. |

### `src/hooks/`

| Arquivo | Descrição |
|---|---|
| `use-toast.ts` | Hook para exibir notificações toast. Gerencia estado global de toasts com `useToast()` e `toast()`. |
| `use-mobile.tsx` | Hook `useIsMobile()` que detecta se a tela é mobile (< 768px). |

---

## 🎨 Design System

As cores e estilos são definidos em `src/index.css` como CSS variables e mapeados no `tailwind.config.ts`:

- **Primária**: Verde oliva (`--primary`)
- **Fundo**: Creme suave (`--background`)
- **Status**: Azul slate (novo), Âmbar (produção), Verde (pronto), Cinza (entregue)
- **Pagamento**: Verde (pago), Âmbar (pendente)
- **Gráficos**: 5 cores temáticas (`--chart-1` a `--chart-5`)

**Regra**: Sempre use tokens semânticos (`bg-primary`, `text-muted-foreground`) em vez de cores diretas.

---

## 🔄 Fluxo de Pedidos

```
Novo → Em Produção → Pronto → Entregue
```

Cada transição é feita clicando no botão de ação do card no Kanban. Pedidos com mais de 15 minutos recebem destaque visual de urgência.

---

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

---

## 📌 Próximos Passos (sugestões)

1. Conectar ao Lovable Cloud para persistir pedidos e produtos em banco de dados
2. Adicionar autenticação para proteger o dashboard (`/admin`)
3. Implementar filtros reais no dashboard (por período)
4. Adicionar busca e filtro por categoria na página de produtos
