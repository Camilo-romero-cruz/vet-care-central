
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExtendedBadge } from '@/components/ui/extended-badge';

interface ProductTableProps {
  products: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
  }>;
  getStockVariant: (status: string) => "success" | "secondary" | "destructive" | "outline";
  getStockText: (status: string) => string;
  onEdit: (product: any) => void;
  onRestock: (product: any) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  getStockVariant,
  getStockText,
  onEdit,
  onRestock,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No se encontraron productos
            </TableCell>
          </TableRow>
        ) : (
          products.map(product => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell className="max-w-[200px] truncate">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell>
                <ExtendedBadge variant={getStockVariant(product.status)}>
                  {getStockText(product.status)}
                </ExtendedBadge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-2 text-xs lg:h-9 lg:px-4 lg:text-sm whitespace-nowrap"
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-2 text-xs lg:h-9 lg:px-4 lg:text-sm whitespace-nowrap"
                    onClick={() => onRestock(product)}
                    disabled={product.status === 'inStock' && product.stock > 40}
                  >
                    Restock
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
