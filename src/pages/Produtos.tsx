/**
 * Página de Cadastro de Produtos
 * CRUD local para gerenciar produtos da gelateria
 * Futuramente conectará ao Supabase para persistência
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/** Estrutura de um produto */
interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
}

/** Categorias disponíveis */
const CATEGORIAS = ['Gelato', 'Picolé', 'Açaí', 'Milk-shake', 'Complemento'] as const;

/** Produtos iniciais de exemplo (mock) */
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', nome: 'Gelato Pistache', preco: 18.90, categoria: 'Gelato', disponivel: true },
  { id: '2', nome: 'Gelato Chocolate Belga', preco: 16.90, categoria: 'Gelato', disponivel: true },
  { id: '3', nome: 'Picolé Maracujá', preco: 8.90, categoria: 'Picolé', disponivel: false },
  { id: '4', nome: 'Açaí 500ml', preco: 22.90, categoria: 'Açaí', disponivel: true },
];

/** Estado inicial do formulário */
const EMPTY_FORM = { nome: '', preco: '', categoria: '', disponivel: true };

const Produtos = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  /** Abre o formulário para edição */
  const handleEdit = (product: Product) => {
    setForm({
      nome: product.nome,
      preco: product.preco.toString(),
      categoria: product.categoria,
      disponivel: product.disponivel,
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  /** Abre o formulário limpo para novo produto */
  const handleNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  /** Salva produto (cria ou atualiza) */
  const handleSave = () => {
    if (!form.nome.trim() || !form.preco || !form.categoria) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    const preco = parseFloat(form.preco);
    if (isNaN(preco) || preco <= 0) {
      toast({ title: 'Preço inválido', variant: 'destructive' });
      return;
    }

    if (editingId) {
      // Atualiza existente
      setProducts(prev =>
        prev.map(p =>
          p.id === editingId
            ? { ...p, nome: form.nome.trim(), preco, categoria: form.categoria, disponivel: form.disponivel }
            : p
        )
      );
      toast({ title: 'Produto atualizado' });
    } else {
      // Cria novo
      const newProduct: Product = {
        id: Date.now().toString(),
        nome: form.nome.trim(),
        preco,
        categoria: form.categoria,
        disponivel: form.disponivel,
      };
      setProducts(prev => [...prev, newProduct]);
      toast({ title: 'Produto cadastrado' });
    }

    setDialogOpen(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  /** Remove produto */
  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Produto removido' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o cardápio da gelateria</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    placeholder="Ex: Gelato Pistache"
                  />
                </div>

                {/* Preço */}
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.preco}
                    onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={val => setForm(f => ({ ...f, categoria: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Disponível */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="disponivel">Disponível para venda</Label>
                  <Switch
                    id="disponivel"
                    checked={form.disponivel}
                    onCheckedChange={val => setForm(f => ({ ...f, disponivel: val }))}
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de produtos */}
        <div className="kpi-card">
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum produto cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.nome}</TableCell>
                    <TableCell className="text-right">
                      R$ {product.preco.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${product.disponivel ? 'bg-[hsl(var(--status-ready))]' : 'bg-[hsl(var(--destructive))]'}`} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Produtos;
