import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; base_price: number; is_available: boolean }) => Promise<unknown>;
}

export const CreateProductDialog = ({ open, onOpenChange, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({ name: name.trim(), base_price: parseFloat(price) || 0, is_available: available });
      setName(''); setPrice(''); setAvailable(true);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Pote 500ml" />
          </div>
          <div className="space-y-2">
            <Label>Preço (R$)</Label>
            <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Disponível</Label>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? 'Criando...' : 'Criar Produto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
