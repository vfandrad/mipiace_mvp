import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Certifique-se de que este componente existe em components/ui

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  // ATUALIZADO: Agora aceita is_required
  onCreate: (data: { 
    name: string; 
    min_choices: number; 
    max_choices: number; 
    is_required: boolean; 
    product_id: string 
  }) => Promise<unknown>;
}

export const CreateGroupDialog = ({ open, onOpenChange, productId, productName, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('3');
  const [isRequired, setIsRequired] = useState(false); // NOVO: Estado para obrigatoriedade
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !productId) return;
    
    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        min_choices: Math.max(0, parseInt(min) || 0),
        max_choices: Math.max(1, parseInt(max) || 1),
        is_required: isRequired, // ENVIANDO O CAMPO FALTANTE
        product_id: productId,
      });
      
      // Resetar estados após sucesso
      setName(''); 
      setMin('0'); 
      setMax('3');
      setIsRequired(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar categoria no diálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria para "{productName}"</DialogTitle>
          <DialogDescription>
            Configure as regras de escolha para os complementos deste produto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome da Categoria */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input 
              id="name"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: Sabores, Adicionais, Coberturas" 
            />
          </div>

          {/* Configurações de Quantidade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Mín. Escolhas</Label>
              <Input 
                id="min"
                type="number" 
                value={min} 
                onChange={e => setMin(e.target.value)} 
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Máx. Escolhas</Label>
              <Input 
                id="max"
                type="number" 
                value={max} 
                onChange={e => setMax(e.target.value)} 
                min="1"
              />
            </div>
          </div>

          {/* Switch de Obrigatoriedade - O que faltava para alinhar com o Banco */}
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label className="text-base">Obrigatório?</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                O cliente será forçado a escolher pelo menos um item.
              </p>
            </div>
            <Switch
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !name.trim() || !productId}
          >
            {loading ? 'Criando...' : 'Criar Categoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};