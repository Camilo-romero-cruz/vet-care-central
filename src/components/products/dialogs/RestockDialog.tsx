
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

interface RestockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: any;
  restockAmount: string;
  onRestockAmountChange: (value: string) => void;
  onSave: () => void;
}

export const RestockDialog: React.FC<RestockDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  restockAmount,
  onRestockAmountChange,
  onSave,
}) => {
  if (!selectedProduct) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Restock de Producto</DialogTitle>
          <DialogDescription>
            Añada más unidades de {selectedProduct.name} al inventario
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Stock actual:</span>
            <span className="font-medium">{selectedProduct.stock} unidades</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restock-amount">Cantidad a añadir</Label>
            <Input
              id="restock-amount"
              placeholder="0"
              type="number"
              min="1"
              value={restockAmount}
              onChange={(e) => onRestockAmountChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancelar</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Confirmar Restock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
