import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { ApiGroup, ApiComplement } from '@/types/order';

interface Props {
  group: ApiGroup;
  complements: ApiComplement[];
  isSaving: boolean;
  onToggleComplement: (c: ApiComplement) => void;
  onEditComplement: (c: ApiComplement) => void;
  onDeleteComplement: (c: ApiComplement) => void;
  onDeleteGroup: () => void;
  onAddComplement: () => void;
}

export const GroupCard = ({
  group, complements, isSaving,
  onToggleComplement, onEditComplement, onDeleteComplement,
  onDeleteGroup, onAddComplement,
}: Props) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{group.name}</CardTitle>
          <Badge variant="outline">{group.is_required ? 'Obrigatório' : 'Opcional'}</Badge>
          <Badge variant="secondary">{group.min_choices}–{group.max_choices} escolhas</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onAddComplement} title="Adicionar complemento">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDeleteGroup} title="Excluir categoria">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Preço Extra</TableHead>
            <TableHead className="text-center">Disponível</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                Sem complementos neste grupo
              </TableCell>
            </TableRow>
          ) : (
            complements.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-right">
                  {c.extra_price > 0 ? `R$ ${c.extra_price.toFixed(2)}` : 'Incluso'}
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={c.is_available} onCheckedChange={() => onToggleComplement(c)} disabled={isSaving} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditComplement(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteComplement(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
