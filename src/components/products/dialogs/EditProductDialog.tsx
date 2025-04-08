
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: any;
  productData: {
    name: string;
    category: string;
    price: string;
    stock: string;
  };
  onProductDataChange: (field: string, value: string) => void;
  onSave: () => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  productData,
  onProductDataChange,
  onSave,
}) => {
  if (!selectedProduct) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifique los campos para actualizar el producto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre</Label>
            <Input
              id="edit-name"
              placeholder="Nombre del producto"
              value={productData.name}
              onChange={(e) => onProductDataChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoría</Label>
            <Select
              onValueChange={(value) => onProductDataChange('category', value)}
              defaultValue={productData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentos">Alimentos</SelectItem>
                <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                <SelectItem value="Higiene">Higiene</SelectItem>
                <SelectItem value="Accesorios">Accesorios</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Precio ($)</Label>
            <Input
              id="edit-price"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              value={productData.price}
              onChange={(e) => onProductDataChange('price', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-stock">Stock (unidades)</Label>
            <Input
              id="edit-stock"
              placeholder="0"
              type="number"
              min="0"
              value={productData.stock}
              onChange={(e) => onProductDataChange('stock', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancelar</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
