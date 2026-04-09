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
import { useProducts } from "@/hooks/use-products";
import { useNavigate } from "react-router-dom";
import ProdutosInserirWindow from "./components/produtos-inserir-window";
import ProdutosAlterarWindow from "./components/produtos-alterar-window";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Produtos() {
  const {
    ProductsQuery,
    RemoveProductMutation,
    AtivarInativarMutation,
    refetch,
  } = useProducts();
  const { data, isLoading } = ProductsQuery();
  const { mutateAsync: mutateAtivarInativar } = AtivarInativarMutation();
  const { mutateAsync: mutateRemoveProduct } = RemoveProductMutation();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await mutateRemoveProduct(id);
      toast.success("Produto removido");
      refetch();
    } catch (error) {
      toast.error("Existe pedidos associados a este produto");
    }
  };

  const handleAtivatInativar = async (id: string, val: boolean) => {
    try {
      await mutateAtivarInativar({ id, is_available: val });
      toast.success(val ? "Produto ativado" : "Produto inativado");
      refetch();
    } catch {
      toast.error("Erro ao alterar disponibilidade");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <ProdutosInserirWindow />
        <ProdutosAlterarWindow />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie o cardápio da gelateria
            </p>
          </div>
          <Button onClick={() => navigate("/produtos?inserir")}>
            <Plus className="h-4 w-4 " />
            <span className="hidden sm:inline">Novo Produto</span>
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
                {!data ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum produto cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">
                        R$ {p.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center text-center gap-3">
                          <div
                            className={`inline-block w-3 h-3 rounded-full ${p.is_available ? "bg-[hsl(var(--status-ready))]" : "bg-[hsl(var(--destructive))]"}`}
                          />
                          <Switch
                            id="disponivel"
                            defaultChecked={p.is_available}
                            checked={p.is_available}
                            onCheckedChange={(val) =>
                              handleAtivatInativar(p.id, val)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/produtos?alterar=${p.id}`)
                              }
                            >
                              <PencilIcon className="h-4 w-4 text-blue-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Alterar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2Icon className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Deletar</TooltipContent>
                        </Tooltip>
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
