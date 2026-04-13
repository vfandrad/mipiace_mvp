/**
 * Página de Produtos — CRUD completo de Inventário
 * POST/PATCH/DELETE via API, com Dialogs, Sheets e AlertDialogs
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { ApiProduct, ApiGroup, ApiComplement } from '@/types/order';
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
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newComplementGroupId, setNewComplementGroupId] = useState<string | null>(null);

  // Edit sheet
  const [editTarget, setEditTarget] = useState<{ type: 'product' | 'complement'; item: ApiProduct | ApiComplement } | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'complement' | 'group'; id: string; name: string } | null>(null);

  const complementsByGroup = (groupId: string) =>
    complements.filter(c => c.group_id === groupId);

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'group') {
      hook.deleteGroup(deleteTarget.id);
    } else {
      hook.deleteItem(deleteTarget.type, deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <ProductsHeader
          onNewProduct={() => setShowNewProduct(true)}
          onNewGroup={() => setShowNewGroup(true)}
        />

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <>
            <ProductsTable
              products={products}
              isSaving={hook.isSaving}
              onToggle={(p) => hook.toggleAvailability('product', p.id, !p.is_available)}
              onEdit={(p) => setEditTarget({ type: 'product', item: p })}
              onDelete={(p) => setDeleteTarget({ type: 'product', id: p.id, name: p.name })}
            />

            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                complements={complementsByGroup(group.id)}
                isSaving={hook.isSaving}
                onToggleComplement={(c) => hook.toggleAvailability('complement', c.id, !c.is_available)}
                onEditComplement={(c) => setEditTarget({ type: 'complement', item: c })}
                onDeleteComplement={(c) => setDeleteTarget({ type: 'complement', id: c.id, name: c.name })}
                onDeleteGroup={() => setDeleteTarget({ type: 'group', id: group.id, name: group.name })}
                onAddComplement={() => setNewComplementGroupId(group.id)}
              />
            ))}
          </>
        )}

        {/* Dialogs */}
        <CreateProductDialog open={showNewProduct} onOpenChange={setShowNewProduct} onCreate={hook.createProduct} />
        <CreateGroupDialog open={showNewGroup} onOpenChange={setShowNewGroup} onCreate={hook.createGroup} />
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
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
};

export default Produtos;
