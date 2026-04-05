import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWindow } from "@/hooks/use-window";
import ProdutosForm from "./produtos-form";

export default function ProdutosAlterarWindow() {
  const { setIsOpen, isOpen } = useWindow("alterar");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Produto</DialogTitle>
        </DialogHeader>
        <ProdutosForm />
      </DialogContent>
    </Dialog>
  );
}
