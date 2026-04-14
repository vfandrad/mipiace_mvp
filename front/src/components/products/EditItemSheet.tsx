import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiProduct, ApiComplement } from '@/types/order';

interface Props {
  editTarget: { type: 'product' | 'complement'; item: ApiProduct | ApiComplement } | null;
  onClose: () => void;
  onSave: (type: 'product' | 'complement', id: string, data: Record<string, unknown>) => Promise<unknown>;
}

export const EditItemSheet = ({ editTarget, onClose, onSave }: Props) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setName(editTarget.item.name);
      setPrice(
        editTarget.type === 'product'
          ? String((editTarget.item as ApiProduct).base_price ?? 0)
          : String((editTarget.item as ApiComplement).extra_price ?? 0)
      );
    }
  }, [editTarget]);

  const handleSave = async () => {
    if (!editTarget) return;
    setLoading(true);
    try {
      const data: Record<string, unknown> = { name };
      if (editTarget.type === 'product') {
        data.base_price = parseFloat(price) || 0;
      } else {
        data.extra_price = parseFloat(price) || 0;
      }
      await onSave(editTarget.type, editTarget.item.id, data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={!!editTarget} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar {editTarget?.type === 'product' ? 'Produto' : 'Complemento'}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{editTarget?.type === 'product' ? 'Preço Base (R$)' : 'Preço Extra (R$)'}</Label>
            <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
