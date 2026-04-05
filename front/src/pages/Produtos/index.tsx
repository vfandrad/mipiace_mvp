/**
 * Página de Produtos — CRUD para gerenciar o cardápio
 * Dados vêm da API real via useProducts
 */

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";
import ProdutosAlterarWindow from "./components/produtos-alterar-window";
import { Link } from "react-router-dom";
import ProdutosInserirWindow from "./components/produtos-inserir-window";

export default function Produtos() {
  const { products, isLoading, removeProduct, ativarInativarProduct, refetch } =
    useProducts();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await removeProduct(id);
      toast({ title: "Produto removido" });
    } catch (error) {
      toast({
        title: "Existe pedidos associados a este produto",
        variant: "destructive",
      });
    }
  };

  const handleAtivatInativar = async (id: string, val: boolean) => {
    try {
      await ativarInativarProduct(id, val);
      toast({
        title: val ? "Produto ativado" : "Produto inativado",
      });
      refetch();
    } catch {
      toast({
        title: "Erro ao alterar disponibilidade",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProdutosInserirWindow />
      <ProdutosAlterarWindow />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sabores</h1>
            <p className="text-muted-foreground">
              Gerencie o cardápio da gelateria
            </p>
          </div>
          <Button>
            <Link to={`/produtos?inserir`} className="flex items-center ">
              <Plus className="h-4 w-4 sm:mr-2" />
              <div className="hidden sm:inline">Novo Sabor</div>
            </Link>
          </Button>
        </div>
        <div className="kpi-card">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
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
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum produto cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-right">
                        R$ {p.preco.toFixed(2)}
                      </TableCell>
                      <TableCell className="flex items-center justify-center text-center gap-3">
                        <div
                          className={`inline-block w-3 h-3 rounded-full ${p.disponivel ? "bg-[hsl(var(--status-ready))]" : "bg-[hsl(var(--destructive))]"}`}
                        />
                        <Switch
                          id="disponivel"
                          defaultChecked={p.disponivel}
                          checked={p.disponivel}
                          onCheckedChange={(val) =>
                            handleAtivatInativar(p.id, val)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Link to={`/produtos?alterar=${p.id}`}>
                            <PencilIcon className="h-4 w-4 text-blue-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2Icon className="h-4 w-4 text-destructive" />
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
}
