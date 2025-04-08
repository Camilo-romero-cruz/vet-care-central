
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

interface NewProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: {
    name: string;
    category: string;
    price: string;
    stock: string;
  };
  onNewProductChange: (field: string, value: string) => void;
  onSave: () => void;
}

export const NewProductDialog: React.FC<NewProductDialogProps> = ({
  isOpen,
  onOpenChange,
  newProduct,
  onNewProductChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar un nuevo producto al inventario
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => onNewProductChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              onValueChange={(value) => onNewProductChange('category', value)}
              defaultValue={newProduct.category}
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
            <Label htmlFor="price">Precio ($)</Label>
            <Input
              id="price"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => onNewProductChange('price', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock (unidades)</Label>
            <Input
              id="stock"
              placeholder="0"
              type="number"
              min="0"
              value={newProduct.stock}
              onChange={(e) => onNewProductChange('stock', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancelar</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
