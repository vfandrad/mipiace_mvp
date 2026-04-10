/**
 * Página de Produtos — Gestão de Inventário
 * Exibe Produtos e seus Grupos de Complementos em hierarquia
 * Toggle de disponibilidade via PATCH /products/{type}/{id}
 * Edição profunda via Sheet lateral (drill-down nos grupos)
 */

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/use-products';
import { ApiProduct, ApiGroup, ApiComplement } from '@/types/order';

const Produtos = () => {
  const { products, groups, complements, isLoading, toggleAvailability, isSaving } = useProducts();

  // Sheet de edição profunda: mostra grupos e complementos de um produto
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);

  // Complementos agrupados por grupo
  const complementsByGroup = (groupId: string) =>
    complements.filter(c => c.group_id === groupId);

  const handleToggleProduct = (product: ApiProduct) => {
    toggleAvailability('product', product.id, !product.is_available);
    toast.success(`${product.name} ${!product.is_available ? 'disponível' : 'indisponível'}`);
  };

  const handleToggleComplement = (complement: ApiComplement) => {
    toggleAvailability('complement', complement.id, !complement.is_available);
    toast.success(`${complement.name} ${!complement.is_available ? 'disponível' : 'indisponível'}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o cardápio e complementos</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <>
            {/* Tabela de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produtos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-center">Disponível</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Nenhum produto cadastrado na API
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-right">R$ {(p.base_price ?? 0).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={p.is_available}
                              onCheckedChange={() => handleToggleProduct(p)}
                              disabled={isSaving}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(p)}>
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Tabelas de Complementos por Grupo */}
            {groups.map(group => {
              const groupComplements = complementsByGroup(group.id);
              return (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {group.is_required ? 'Obrigatório' : 'Opcional'}
                        </Badge>
                        <Badge variant="secondary">
                          {group.min_choices}–{group.max_choices} escolhas
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Preço Extra</TableHead>
                          <TableHead className="text-center">Disponível</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupComplements.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                              Sem complementos neste grupo
                            </TableCell>
                          </TableRow>
                        ) : (
                          groupComplements.map(c => (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.name}</TableCell>
                              <TableCell className="text-right">
                                {c.extra_price > 0 ? `R$ ${c.extra_price.toFixed(2)}` : 'Incluso'}
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch
                                  checked={c.is_available}
                                  onCheckedChange={() => handleToggleComplement(c)}
                                  disabled={isSaving}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        {/* Sheet de edição profunda do produto */}
        <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{selectedProduct?.name}</SheetTitle>
            </SheetHeader>
            {selectedProduct && (
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Preço Base</p>
                  <p className="text-2xl font-bold">R$ {(selectedProduct.base_price ?? 0).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Disponível</span>
                  <Switch
                    checked={selectedProduct.is_available}
                    onCheckedChange={() => {
                      handleToggleProduct(selectedProduct);
                      setSelectedProduct({ ...selectedProduct, is_available: !selectedProduct.is_available });
                    }}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Grupos de Complementos</h4>
                  {groups.map(group => (
                    <div key={group.id} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{group.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {group.min_choices}–{group.max_choices}
                        </Badge>
                        {group.is_required && (
                          <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                        )}
                      </div>
                      <div className="space-y-1 pl-2">
                        {complementsByGroup(group.id).map(c => (
                          <div key={c.id} className="flex items-center justify-between text-sm py-1">
                            <span className={c.is_available ? '' : 'text-muted-foreground line-through'}>
                              {c.name}
                            </span>
                            <span className="text-muted-foreground">
                              {c.extra_price > 0 ? `+R$ ${c.extra_price.toFixed(2)}` : 'Incluso'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Produtos;
