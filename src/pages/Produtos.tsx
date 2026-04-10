/**
 * Página de Produtos — CRUD com categorias
 * Produtos agrupados por categoria em tabelas separadas
 */

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';

const EMPTY_PRODUCT_FORM = { nome: '', preco: '', disponivel: true, categoria: '' };
const EMPTY_CATEGORY_FORM = { nome: '' };

const Produtos = () => {
  const {
    products, isLoading, addProduct, removeProduct, toggleAvailability,
    categories, addCategory, removeCategory, isSaving,
  } = useProducts();
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Agrupa produtos por categoria
  const groupedProducts = useMemo(() => {
    const groups: Record<string, typeof products> = {};
    for (const p of products) {
      const cat = p.categoria || 'Sem categoria';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    // Ordena: categorias cadastradas primeiro, depois "Sem categoria"
    const sortedKeys = [
      ...categories.filter(c => groups[c]),
      ...Object.keys(groups).filter(k => !categories.includes(k)),
    ];
    return sortedKeys.map(key => ({ category: key, items: groups[key] }));
  }, [products, categories]);

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
      await addProduct(productForm.nome.trim(), preco, productForm.disponivel, productForm.categoria || 'Sem categoria');
      toast({ title: 'Produto cadastrado' });
      setProductDialogOpen(false);
      setProductForm(EMPTY_PRODUCT_FORM);
    } catch {
      toast({ title: 'Erro ao salvar produto', variant: 'destructive' });
    }
  };

  const handleSaveCategory = () => {
    const nome = categoryForm.nome.trim();
    if (!nome) {
      toast({ title: 'Informe o nome da categoria', variant: 'destructive' });
      return;
    }
    if (categories.includes(nome)) {
      toast({ title: 'Categoria já existe', variant: 'destructive' });
      return;
    }
    addCategory(nome);
    toast({ title: 'Categoria criada' });
    setCategoryDialogOpen(false);
    setCategoryForm(EMPTY_CATEGORY_FORM);
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
            <p className="text-muted-foreground">Gerencie o cardápio da gelateria</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setCategoryForm(EMPTY_CATEGORY_FORM); setCategoryDialogOpen(true); }}>
              <FolderPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Nova Categoria</span>
            </Button>
            <Button onClick={() => { setProductForm(EMPTY_PRODUCT_FORM); setProductDialogOpen(true); }}>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Produto</span>
            </Button>
          </div>
        </div>

        {/* Dialog: Nova Categoria */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="cat-nome">Nome</Label>
                <Input
                  id="cat-nome"
                  value={categoryForm.nome}
                  onChange={e => setCategoryForm({ nome: e.target.value })}
                  placeholder="Ex: Potes, Casquinhas, Extras"
                />
              </div>
              <Button onClick={handleSaveCategory} className="w-full">
                Criar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Novo Produto */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="prod-nome">Nome</Label>
                <Input
                  id="prod-nome"
                  value={productForm.nome}
                  onChange={e => setProductForm(f => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: Gelato Pistache"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-preco">Preço (R$)</Label>
                <Input
                  id="prod-preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.preco}
                  onChange={e => setProductForm(f => ({ ...f, preco: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              {categories.length > 0 && (
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={productForm.categoria} onValueChange={val => setProductForm(f => ({ ...f, categoria: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="prod-disponivel">Disponível para venda</Label>
                <Switch
                  id="prod-disponivel"
                  checked={productForm.disponivel}
                  onCheckedChange={val => setProductForm(f => ({ ...f, disponivel: val }))}
                />
              </div>
              <Button onClick={handleSaveProduct} className="w-full" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Cadastrar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : groupedProducts.length === 0 ? (
          <div className="kpi-card p-8 text-center text-muted-foreground">
            Nenhum produto cadastrado. Crie uma categoria e adicione produtos.
          </div>
        ) : (
          groupedProducts.map(({ category, items }) => (
            <div key={category} className="kpi-card">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="text-lg font-semibold">{category}</h2>
                {category !== 'Sem categoria' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      removeCategory(category);
                      toast({ title: 'Categoria removida' });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-center">Disponível</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-right">R$ {(p.preco ?? 0).toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={p.disponivel}
                          onCheckedChange={(val) => toggleAvailability(p.id, val)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Produtos;
