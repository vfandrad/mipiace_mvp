/**
 * Página de Produtos — CRUD com filtros por categoria
 * Suporta categorias: tamanho, sabor, extra
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { ItemCategory } from '@/lib/api';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  tamanho: 'Tamanho',
  sabor: 'Sabor',
  extra: 'Extra',
};

const CATEGORY_COLORS: Record<ItemCategory, string> = {
  tamanho: 'bg-[hsl(var(--chart-1))]',
  sabor: 'bg-[hsl(var(--chart-2))]',
  extra: 'bg-[hsl(var(--chart-3))]',
};

type FilterCategory = 'todos' | ItemCategory;

const EMPTY_FORM = { nome: '', preco: '', categoria: 'tamanho' as ItemCategory, maxSabores: '2', disponivel: true };

const Produtos = () => {
  const { products, isLoading, addProduct, removeProduct, toggleAvailability, isSaving } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>('todos');
  const { toast } = useToast();

  const filteredProducts = filter === 'todos' ? products : products.filter(p => p.categoria === filter);

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast({ title: 'Preencha o nome', variant: 'destructive' });
      return;
    }

    const preco = parseFloat(form.preco || '0');
    if (form.categoria !== 'sabor' && (isNaN(preco) || preco <= 0)) {
      toast({ title: 'Preço inválido', variant: 'destructive' });
      return;
    }

    const maxSabores = parseInt(form.maxSabores || '0', 10);

    try {
      await addProduct(
        form.nome.trim(),
        form.categoria === 'sabor' ? 0 : preco,
        form.categoria,
        form.categoria === 'tamanho' ? maxSabores : 0,
        form.disponivel,
      );
      toast({ title: 'Item cadastrado' });
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    } catch {
      toast({ title: 'Erro ao salvar item', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeProduct(id);
      toast({ title: 'Item removido' });
    } catch {
      toast({ title: 'Erro ao remover item', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cardápio</h1>
            <p className="text-muted-foreground">Gerencie tamanhos, sabores e extras</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filtro por categoria */}
            <div className="flex items-center bg-secondary rounded-lg p-1">
              {(['todos', 'tamanho', 'sabor', 'extra'] as const).map(cat => (
                <Button
                  key={cat}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    filter === cat
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat === 'todos' ? 'Todos' : CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setForm(EMPTY_FORM); setDialogOpen(true); }}>
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Novo Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={form.categoria} onValueChange={(v) => setForm(f => ({ ...f, categoria: v as ItemCategory }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tamanho">Tamanho</SelectItem>
                        <SelectItem value="sabor">Sabor</SelectItem>
                        <SelectItem value="extra">Extra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder={form.categoria === 'tamanho' ? 'Ex: Pote 500ml' : form.categoria === 'sabor' ? 'Ex: Pistache' : 'Ex: Cascão Artesanal'} />
                  </div>

                  {/* Preço — escondido para sabores */}
                  {form.categoria !== 'sabor' && (
                    <div className="space-y-2">
                      <Label htmlFor="preco">Preço (R$)</Label>
                      <Input id="preco" type="number" step="0.01" min="0" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} placeholder="0.00" />
                    </div>
                  )}

                  {/* Limite de sabores — apenas para tamanho */}
                  {form.categoria === 'tamanho' && (
                    <div className="space-y-2">
                      <Label htmlFor="maxSabores">Limite de Sabores</Label>
                      <Input id="maxSabores" type="number" min="1" max="10" value={form.maxSabores} onChange={e => setForm(f => ({ ...f, maxSabores: e.target.value }))} placeholder="2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="disponivel">Disponível</Label>
                    <Switch id="disponivel" checked={form.disponivel} onCheckedChange={val => setForm(f => ({ ...f, disponivel: val }))} />
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Cadastrar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="kpi-card">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Sabores</TableHead>
                  <TableHead className="text-center">Disponível</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {filter === 'todos' ? 'Nenhum item cadastrado' : `Nenhum item na categoria "${CATEGORY_LABELS[filter]}"`}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white', CATEGORY_COLORS[p.categoria])}>
                          {CATEGORY_LABELS[p.categoria]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.categoria === 'sabor' ? '—' : `R$ ${p.preco.toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        {p.categoria === 'tamanho' ? p.maxSabores : '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={p.disponivel}
                          onCheckedChange={(val) => toggleAvailability(p.id, val)}
                          aria-label={`Toggle ${p.nome}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Produtos;
