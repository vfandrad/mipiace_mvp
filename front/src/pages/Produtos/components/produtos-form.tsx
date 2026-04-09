import { Button } from "@/components/ui/button";
import {
  CheckboxField,
  NumberField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/ui/form/fields";
import { RootForm } from "@/components/ui/form/RootForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { useWindow } from "@/hooks/use-window";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProdutosForm() {
  const { paramValue } = useWindow("alterar");
  const {
    AddProductMutation,
    UpdateProductMutation,
    refetch,
    ProductDetailQuery,
  } = useProducts();
  const { data } = ProductDetailQuery(paramValue);
  const { mutateAsync: updateProductMutate, isPending: isPendingUpdate } =
    UpdateProductMutation();
  const { mutateAsync: addProductMutate, isPending: isPendingAdd } =
    AddProductMutation();
  const navigate = useNavigate();
  const form = useForm();

  const handleSave = async () => {
    try {
      if (paramValue) {
        await updateProductMutate({
          id: paramValue,
          nome: form.getValues("name").trim(),
          preco: form.getValues("price"),
          disponivel: form.getValues("is_available"),
        });
        toast.success("Produto atualizado");
      } else {
        await addProductMutate({
          nome: form.getValues("name").trim(),
          preco: form.getValues("price"),
          disponivel: form.getValues("is_available"),
        });
        toast.success("Produto cadastrado");
      }
      refetch();
      navigate("/produtos");
      form.reset();
    } catch {
      toast.error("Erro ao salvar produto");
    }
  };

  useEffect(() => {
    if (!data) return;
    form.reset(data);
  }, [data, form]);

  return (
    <RootForm {...form} onSubmit={handleSave} className="space-y-2">
      <TextField
        name="name"
        label="Nome"
        placeholder="Ex: Gelato Pistache"
        required
      />
      <NumberField
        name="price"
        label="Preço (R$)"
        placeholder="0.00"
        required
      />
      <SwitchField
        name="is_available"
        label="Disponível para venda?"
        defaultChecked={true}
      />
      <Button className="w-full" disabled={isPendingAdd || isPendingUpdate}>
        {isPendingAdd || isPendingUpdate
          ? "Salvando..."
          : paramValue
            ? "Atualizar Produto"
            : "Cadastrar Produto"}
      </Button>
    </RootForm>
  );
}
