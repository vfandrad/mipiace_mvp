/**
 * Página de Produtos — Padrão PDV Profissional
 * Hierarquia: Produto (Card) > Categoria/Grupo > Complementos
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/use-products';
import { ApiProduct, ApiComplement } from '@/types/order';
import { ProductsHeader } from '@/components/products/ProductsHeader';
import { GroupCard } from '@/components/products/GroupCard';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import { CreateGroupDialog } from '@/components/products/CreateGroupDialog';
import { CreateComplementDialog } from '@/components/products/CreateComplementDialog';
import { EditItemSheet } from '@/components/products/EditItemSheet';
import { DeleteConfirmDialog } from '@/components/products/DeleteConfirmDialog';
import { Pencil, Trash2, FolderPlus } from 'lucide-react';

const Produtos = () => {
  const hook = useProducts();
  const { products, groups, complements, isLoading } = hook;

  const [showNewProduct, setShowNewProduct] = useState(false);
  const [newGroupProduct, setNewGroupProduct] = useState<{ id: string; name: string } | null>(null);
  const [newComplementGroupId, setNewComplementGroupId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<{ type: 'product' | 'complement'; item: ApiProduct | ApiComplement } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'complement' | 'complement_group';
    id: string;
    name: string;
    cascadeWarning?: boolean;
  } | null>(null);

  const groupsByProduct = (productId: string) => groups.filter(g => g.product_id === productId);
  const complementsByGroup = (groupId: string) => complements.filter(c => c.group_id === groupId);

  const handleDelete = () => {
    if (!deleteTarget) return;
    hook.deleteItem(deleteTarget.type, deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <ProductsHeader onNewProduct={() => setShowNewProduct(true)} />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map(product => {
              const pGroups = groupsByProduct(product.id);
              return (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <Badge variant="secondary">R$ {(product.base_price ?? 0).toFixed(2)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.is_available}
                          onCheckedChange={() => hook.toggleAvailability('product', product.id, !product.is_available)}
                          disabled={hook.isSaving}
                        />
                        <Button variant="ghost" size="icon" onClick={() => setEditTarget({ type: 'product', item: product })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget({
                            type: 'product', id: product.id, name: product.name,
                            cascadeWarning: pGroups.length > 0,
                          })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Categorias/Grupos deste produto */}
                    {pGroups.map(group => (
                      <div key={group.id}>
                        <GroupCard
                          group={group}
                          complements={complementsByGroup(group.id)}
                          isSaving={hook.isSaving}
                          onToggleComplement={(c) => hook.toggleAvailability('complement', c.id, !c.is_available)}
                          onEditComplement={(c) => setEditTarget({ type: 'complement', item: c })}
                          onDeleteComplement={(c) => setDeleteTarget({ type: 'complement', id: c.id, name: c.name })}
                          onDeleteGroup={() => setDeleteTarget({
                            type: 'complement_group', id: group.id, name: group.name,
                            cascadeWarning: complementsByGroup(group.id).length > 0,
                          })}
                          onAddComplement={() => setNewComplementGroupId(group.id)}
                        />
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setNewGroupProduct({ id: product.id, name: product.name })}
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Nova Categoria para "{product.name}"
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialogs */}
        <CreateProductDialog open={showNewProduct} onOpenChange={setShowNewProduct} onCreate={hook.createProduct} />
        <CreateGroupDialog
          open={!!newGroupProduct}
          onOpenChange={(open) => !open && setNewGroupProduct(null)}
          productId={newGroupProduct?.id ?? ''}
          productName={newGroupProduct?.name ?? ''}
          onCreate={hook.createGroup}
        />
        <CreateComplementDialog
          open={!!newComplementGroupId}
          onOpenChange={(open) => !open && setNewComplementGroupId(null)}
          groupId={newComplementGroupId ?? ''}
          onCreate={hook.createComplement}
        />
        <EditItemSheet editTarget={editTarget} onClose={() => setEditTarget(null)} onSave={hook.editItem} />
        <DeleteConfirmDialog
          open={!!deleteTarget}
          name={deleteTarget?.name ?? ''}
          cascadeWarning={deleteTarget?.cascadeWarning}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
};

export default Produtos;
