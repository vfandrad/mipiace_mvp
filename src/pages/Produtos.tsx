/**
 * Página de Produtos — gerenciamento em árvore
 * Produto > Grupos de Complementos > Complementos
 * Dados vêm da API FastAPI via GET /products
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight, Package, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { Product, ComplementGroup } from '@/types/order';

const EMPTY_PRODUCT_FORM = { nome: '', preco: '', disponivel: true };

const Produtos = () => {
  const { products, isLoading, addProduct, removeProduct, isSaving } = useProducts();
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleExpand = (id: string) => {
    setExpandedProducts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSaveProduct = async () => {
    if (!productForm.nome.trim() || !productForm.preco) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    const preco = parseFloat(productForm.preco);
    if (isNaN(preco) || preco <= 0) {
      toast({ title: 'Preço inválido', variant: 'destructive' });
      return;
    }
    try {
      await addProduct(productForm.nome.trim(), preco, productForm.disponivel);
      toast({ title: 'Produto cadastrado' });
      setProductDialogOpen(false);
      setProductForm(EMPTY_PRODUCT_FORM);
    } catch {
      toast({ title: 'Erro ao salvar produto', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeProduct(id);
      toast({ title: 'Produto removido' });
    } catch {
      toast({ title: 'Erro ao remover produto', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o cardápio e complementos</p>
          </div>
          <Button onClick={() => { setProductForm(EMPTY_PRODUCT_FORM); setProductDialogOpen(true); }}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Novo Produto</span>
          </Button>
        </div>

        {/* Dialog: Novo Produto */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="prod-nome">Nome</Label>
                <Input id="prod-nome" value={productForm.nome} onChange={e => setProductForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Pote 500ml" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-preco">Preço (R$)</Label>
                <Input id="prod-preco" type="number" step="0.01" min="0" value={productForm.preco} onChange={e => setProductForm(f => ({ ...f, preco: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="prod-disponivel">Disponível para venda</Label>
                <Switch id="prod-disponivel" checked={productForm.disponivel} onCheckedChange={val => setProductForm(f => ({ ...f, disponivel: val }))} />
              </div>
              <Button onClick={handleSaveProduct} className="w-full" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Cadastrar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lista de produtos em árvore */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="kpi-card p-8 text-center text-muted-foreground">
            Nenhum produto cadastrado. Adicione seu primeiro produto.
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductTreeItem
                key={product.id}
                product={product}
                isExpanded={expandedProducts.has(product.id)}
                onToggle={() => toggleExpand(product.id)}
                onDelete={() => handleDelete(product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

/** Item da árvore: Produto com seus grupos e complementos */
function ProductTreeItem({ product, isExpanded, onToggle, onDelete }: {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const groups = product.complement_groups ?? [];
  const hasGroups = groups.length > 0;

  return (
    <div className="kpi-card p-0 overflow-hidden">
      {/* Produto principal */}
      <div className="flex items-center gap-3 px-4 py-3">
        {hasGroups ? (
          <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <Package className="h-4 w-4 text-muted-foreground" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{product.name}</span>
            {hasGroups && (
              <Badge variant="secondary" className="text-xs">
                {groups.length} grupo{groups.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          R$ {(product.price ?? 0).toFixed(2)}
        </span>

        <Switch checked={product.is_available} disabled />

        <Button variant="ghost" size="icon" onClick={onDelete} className="shrink-0">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {/* Grupos de complementos expandidos */}
      {hasGroups && isExpanded && (
        <div className="border-t border-border bg-secondary/30">
          {groups.map((group) => (
            <ComplementGroupItem key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Grupo de complementos com seus itens */
function ComplementGroupItem({ group }: { group: ComplementGroup }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-6 py-2 text-sm hover:bg-secondary/50 text-left">
        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{group.name}</span>
        <Badge variant="outline" className="text-xs ml-auto">
          {group.complements.length} opções
        </Badge>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-10 pr-4 pb-2 space-y-1">
          {group.complements.map((comp) => (
            <div key={comp.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className={comp.is_available ? '' : 'text-muted-foreground line-through'}>
                {comp.name}
              </span>
              <div className="flex items-center gap-3">
                {comp.extra_price > 0 && (
                  <span className="text-xs text-muted-foreground">+R$ {comp.extra_price.toFixed(2)}</span>
                )}
                <Switch checked={comp.is_available} disabled className="scale-75" />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default Produtos;
