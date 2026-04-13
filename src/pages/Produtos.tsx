/** Página de Produtos — CRUD de inventário via API */

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

  // Controle de dialogs
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newComplementGroupId, setNewComplementGroupId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<{ type: 'product' | 'complement'; item: ApiProduct | ApiComplement } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'complement' | 'group'; id: string; name: string } | null>(null);

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
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
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
                complements={complements.filter(c => c.group_id === group.id)}
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

        {/* Dialogs de criação, edição e exclusão */}
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
