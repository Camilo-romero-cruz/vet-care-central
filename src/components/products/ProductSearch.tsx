
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: {
    inStock: boolean;
    lowStock: boolean;
    outOfStock: boolean;
    alimentos: boolean;
    medicamentos: boolean;
    higiene: boolean;
    accesorios: boolean;
  };
  onFilterChange: (filter: string, checked: boolean) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  onFilterChange,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 sm:w-72 p-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Estado</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock" 
                  checked={activeFilters.inStock}
                  onCheckedChange={(checked) => onFilterChange('inStock', !!checked)} 
                />
                <Label htmlFor="inStock" className="text-sm">En stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lowStock" 
                  checked={activeFilters.lowStock}
                  onCheckedChange={(checked) => onFilterChange('lowStock', !!checked)} 
                />
                <Label htmlFor="lowStock" className="text-sm">Stock bajo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="outOfStock" 
                  checked={activeFilters.outOfStock}
                  onCheckedChange={(checked) => onFilterChange('outOfStock', !!checked)} 
                />
                <Label htmlFor="outOfStock" className="text-sm">Agotado</Label>
              </div>
            </div>

            <h4 className="font-medium leading-none pt-2 border-t">Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alimentos" 
                  checked={activeFilters.alimentos}
                  onCheckedChange={(checked) => onFilterChange('alimentos', !!checked)} 
                />
                <Label htmlFor="alimentos" className="text-sm">Alimentos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medicamentos" 
                  checked={activeFilters.medicamentos}
                  onCheckedChange={(checked) => onFilterChange('medicamentos', !!checked)} 
                />
                <Label htmlFor="medicamentos" className="text-sm">Medicamentos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="higiene" 
                  checked={activeFilters.higiene}
                  onCheckedChange={(checked) => onFilterChange('higiene', !!checked)} 
                />
                <Label htmlFor="higiene" className="text-sm">Higiene</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="accesorios" 
                  checked={activeFilters.accesorios}
                  onCheckedChange={(checked) => onFilterChange('accesorios', !!checked)} 
                />
                <Label htmlFor="accesorios" className="text-sm">Accesorios</Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
