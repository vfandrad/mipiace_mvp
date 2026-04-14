import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // ✅ ADICIONADO: is_required na tipagem da função
  onCreate: (data: { name: string; min_choices: number; max_choices: number; is_required: boolean }) => Promise<unknown>;
}

export const CreateGroupDialog = ({ open, onOpenChange, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('3');
  const [isRequired, setIsRequired] = useState(false); // ✅ ADICIONADO: Novo estado
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({ 
        name: name.trim(), 
        min_choices: parseInt(min) || 0, 
        max_choices: parseInt(max) || 1,
        is_required: isRequired // ✅ ADICIONADO: Enviando para o banco
      });
      setName(''); setMin('0'); setMax('3'); setIsRequired(false);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
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

          {/* ✅ NOVO CAMPO: Switch para Obrigatório */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Seleção Obrigatória?</Label>
              <p className="text-sm text-muted-foreground">
                O cliente não poderá avançar sem escolher.
              </p>
            </div>
            <Switch 
              checked={isRequired} 
              onCheckedChange={setIsRequired} 
            />
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