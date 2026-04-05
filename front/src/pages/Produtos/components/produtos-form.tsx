import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { useWindow } from "@/hooks/use-window";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY_FORM = { nome: "", preco: "", disponivel: true };

export default function ProdutosForm() {
  const { paramValue } = useWindow("alterar");
  const { toast } = useToast();
  const { addProduct, updateProduct, useProductDetail, isSaving } =
    useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const { data } = useProductDetail(paramValue);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!form.nome.trim() || !form.preco) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    const preco = parseFloat(form.preco);
    if (isNaN(preco) || preco <= 0) {
      toast({ title: "Preço inválido", variant: "destructive" });
      return;
    }

    try {
      if (paramValue) {
        await updateProduct(
          paramValue,
          form.nome.trim(),
          preco,
          form.disponivel,
        );
        toast({ title: "Produto atualizado" });
      } else {
        await addProduct(form.nome.trim(), preco, form.disponivel);
        toast({ title: "Produto cadastrado" });
      }
      navigate("/produtos");
      setForm(EMPTY_FORM);
    } catch {
      toast({ title: "Erro ao salvar produto", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!data) return;
    setForm({
      nome: data?.name,
      preco: String(data?.price),
      disponivel: data?.is_available,
    });
  }, [data]);

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={form.nome}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              nome: e.target.value,
            }))
          }
          placeholder="Ex: Gelato Pistache"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preco">Preço (R$)</Label>
        <Input
          id="preco"
          type="number"
          step="0.01"
          min="0"
          value={form.preco}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              preco: e.target.value,
            }))
          }
          placeholder="0.00"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="disponivel">Disponível para venda</Label>
        <Switch
          id="disponivel"
          checked={form.disponivel}
          onCheckedChange={(val) => setForm((f) => ({ ...f, disponivel: val }))}
        />
      </div>
      <Button onClick={handleSave} className="w-full" disabled={isSaving}>
        {isSaving
          ? "Salvando..."
          : paramValue
            ? "Atualizar Produto"
            : "Cadastrar Produto"}
      </Button>
    </div>
  );
}
