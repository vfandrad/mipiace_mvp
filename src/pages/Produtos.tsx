/**
 * Página de Produtos — CRUD para gerenciar o cardápio
 * Dados vêm da API real via useProducts
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts, Product } from '@/hooks/use-products';

const EMPTY_FORM = { nome: '', preco: '', disponivel: true };

const Produtos = () => {
  const { products, isLoading, addProduct, removeProduct, isSaving } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!form.nome.trim() || !form.preco) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    const preco = parseFloat(form.preco);
    if (isNaN(preco) || preco <= 0) {
      toast({ title: 'Preço inválido', variant: 'destructive' });
      return;
    }

    try {
      await addProduct(form.nome.trim(), preco, form.disponivel);
      toast({ title: 'Produto cadastrado' });
      setDialogOpen(false);
      setForm(EMPTY_FORM);
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
            <p className="text-muted-foreground">Gerencie o cardápio da gelateria</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm(EMPTY_FORM); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Gelato Pistache" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input id="preco" type="number" step="0.01" min="0" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="disponivel">Disponível para venda</Label>
                  <Switch id="disponivel" checked={form.disponivel} onCheckedChange={val => setForm(f => ({ ...f, disponivel: val }))} />
                </div>
                <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Cadastrar Produto'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-center">Disponível</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum produto cadastrado</TableCell>
                  </TableRow>
                ) : (
                  products.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-right">R$ {p.preco.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-block w-3 h-3 rounded-full ${p.disponivel ? 'bg-[hsl(var(--status-ready))]' : 'bg-[hsl(var(--destructive))]'}`} />
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
