/**
 * Página de Produtos — CRUD completo de Inventário
 * Grupos vinculados a produtos com deleção em cascata
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { ApiProduct, ApiComplement } from '@/types/order';
import { ProductsHeader } from '@/components/products/ProductsHeader';
import { ProductsTable } from '@/components/products/ProductsTable';
import { GroupCard } from '@/components/products/GroupCard';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import { CreateGroupDialog } from '@/components/products/CreateGroupDialog';
import { CreateComplementDialog } from '@/components/products/CreateComplementDialog';
import { EditItemSheet } from '@/components/products/EditItemSheet';
import { DeleteConfirmDialog } from '@/components/products/DeleteConfirmDialog';

const Produtos = () => {
  const hook = useProducts();
  const { products, groups, complements, isLoading } = hook;

  // Dialog states
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [newGroupProduct, setNewGroupProduct] = useState<{ id: string; name: string } | null>(null);
  const [newComplementGroupId, setNewComplementGroupId] = useState<string | null>(null);

  // Edit sheet
  const [editTarget, setEditTarget] = useState<{ type: 'product' | 'complement'; item: ApiProduct | ApiComplement } | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'complement' | 'complement_group';
    id: string;
    name: string;
    cascadeWarning?: boolean;
  } | null>(null);

  const groupsByProduct = (productId: string) =>
    groups.filter(g => g.product_id === productId);

  const complementsByGroup = (groupId: string) =>
    complements.filter(c => c.group_id === groupId);

  const handleDelete = () => {
    if (!deleteTarget) return;
    hook.deleteItem(deleteTarget.type, deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <ProductsHeader
          onNewProduct={() => setShowNewProduct(true)}
        />

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          products.map(product => {
            const productGroups = groupsByProduct(product.id);
            return (
              <div key={product.id} className="space-y-3">
                <ProductsTable
                  products={[product]}
                  isSaving={hook.isSaving}
                  onToggle={(p) => hook.toggleAvailability('product', p.id, !p.is_available)}
                  onEdit={(p) => setEditTarget({ type: 'product', item: p })}
                  onDelete={(p) => setDeleteTarget({
                    type: 'product', id: p.id, name: p.name,
                    cascadeWarning: productGroups.length > 0,
                  })}
                  onAddGroup={() => setNewGroupProduct({ id: product.id, name: product.name })}
                />

                {productGroups.map(group => (
                  <div key={group.id} className="ml-6">
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
              </div>
            );
          })
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
