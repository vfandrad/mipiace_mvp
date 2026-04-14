import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  onCreate: (data: { name: string; min_choices: number; max_choices: number; product_id: string }) => Promise<unknown>;
}

export const CreateGroupDialog = ({ open, onOpenChange, productId, productName, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('3');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        min_choices: parseInt(min) || 0,
        max_choices: parseInt(max) || 1,
        product_id: productId,
      });
      setName(''); setMin('0'); setMax('3');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria para "{productName}"</DialogTitle>
          <DialogDescription>
            Esta categoria pertence exclusivamente a este produto. Ex: "Sabores" do Pote 500ml é independente dos "Sabores" do Pote 1000ml.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Sabores, Coberturas" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mín. Escolhas</Label>
              <Input type="number" value={min} onChange={e => setMin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Máx. Escolhas</Label>
              <Input type="number" value={max} onChange={e => setMax(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? 'Criando...' : 'Criar Categoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
