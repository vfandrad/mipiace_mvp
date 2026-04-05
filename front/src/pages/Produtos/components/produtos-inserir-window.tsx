import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWindow } from "@/hooks/use-window";
import ProdutosForm from "./produtos-form";

export default function ProdutosInserirWindow() {
  const { setIsOpen, isOpen } = useWindow("inserir");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Produto</DialogTitle>
        </DialogHeader>
        <ProdutosForm />
      </DialogContent>
    </Dialog>
  );
}
