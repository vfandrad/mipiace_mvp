import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, FolderPlus } from 'lucide-react';
import { ApiProduct } from '@/types/order';

interface Props {
  products: ApiProduct[];
  isSaving: boolean;
  onToggle: (p: ApiProduct) => void;
  onEdit: (p: ApiProduct) => void;
  onDelete: (p: ApiProduct) => void;
  onAddGroup?: () => void;
}

export const ProductsTable = ({ products, isSaving, onToggle, onEdit, onDelete, onAddGroup }: Props) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{products[0]?.name ?? 'Produto'}</CardTitle>
        {onAddGroup && (
          <Button variant="outline" size="sm" onClick={onAddGroup}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-0">
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
          {products.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-right">R$ {(p.base_price ?? 0).toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Switch checked={p.is_available} onCheckedChange={() => onToggle(p)} disabled={isSaving} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(p)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
