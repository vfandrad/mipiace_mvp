import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';

interface Props {
  onNewProduct: () => void;
  onNewGroup: () => void;
}

export const ProductsHeader = ({ onNewProduct, onNewGroup }: Props) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
      <p className="text-muted-foreground text-sm">Gerencie o cardápio e complementos</p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={onNewGroup} title="Nova Categoria" className="sm:hidden">
        <FolderPlus className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={onNewGroup} className="hidden sm:inline-flex">
        <FolderPlus className="h-4 w-4 mr-2" />
        Nova Categoria
      </Button>

      <Button size="icon" onClick={onNewProduct} title="Novo Produto" className="sm:hidden">
        <Plus className="h-4 w-4" />
      </Button>
      <Button onClick={onNewProduct} className="hidden sm:inline-flex">
        <Plus className="h-4 w-4 mr-2" />
        Novo Produto
      </Button>
    </div>
  </div>
);
