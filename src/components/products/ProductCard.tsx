
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
  };
  getStockVariant: (status: string) => "success" | "secondary" | "destructive" | "outline";
  getStockText: (status: string) => string;
  onEdit: (product: any) => void;
  onRestock: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  getStockVariant,
  getStockText,
  onEdit,
  onRestock,
}) => {
  return (
    <Card key={product.id} className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="text-base sm:text-lg flex items-center gap-2 font-semibold leading-none tracking-tight">
            <Package className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{product.name}</span>
          </div>
          <ExtendedBadge variant={getStockVariant(product.status)} className="whitespace-nowrap">
            {getStockText(product.status)}
          </ExtendedBadge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Categoría:</span>
            <span className="font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precio:</span>
            <span className="font-medium">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stock:</span>
            <span className="font-medium">{product.stock} unidades</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              className="flex-1 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
              onClick={() => onEdit(product)}
            >
              Editar
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
              onClick={() => onRestock(product)}
              disabled={product.status === 'inStock' && product.stock > 40}
            >
              Restock
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
