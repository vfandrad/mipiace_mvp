import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; min_choices: number; max_choices: number; is_required: boolean }) => Promise<unknown>;
}

export const CreateGroupDialog = ({ open, onOpenChange, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('3');
  const [required, setRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({ name: name.trim(), min_choices: parseInt(min) || 0, max_choices: parseInt(max) || 1, is_required: required });
      setName(''); setMin('0'); setMax('3'); setRequired(false);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria / Grupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Coberturas" />
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
          <div className="flex items-center justify-between">
            <Label>Obrigatório</Label>
            <Switch checked={required} onCheckedChange={setRequired} />
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
