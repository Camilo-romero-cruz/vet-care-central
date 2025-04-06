
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Search, Plus, Package, Filter, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Estados para diálogos
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    inStock: true,
    lowStock: true,
    outOfStock: true,
    alimentos: true,
    medicamentos: true,
    higiene: true,
    accesorios: true
  });

  // Estados para el nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  // Estado para el restock
  const [restockAmount, setRestockAmount] = useState('');

  // Datos de prueba para productos
  const [products, setProducts] = useState([
    { id: 1, name: 'Alimento para perros Premium', category: 'Alimentos', price: 25.99, stock: 45, status: 'inStock' },
    { id: 2, name: 'Antiparasitario canino', category: 'Medicamentos', price: 15.50, stock: 32, status: 'inStock' },
    { id: 3, name: 'Champú hipoalergénico', category: 'Higiene', price: 12.75, stock: 18, status: 'inStock' },
    { id: 4, name: 'Juguete masticable para perros', category: 'Accesorios', price: 8.99, stock: 7, status: 'lowStock' },
    { id: 5, name: 'Arena para gatos', category: 'Higiene', price: 10.25, stock: 0, status: 'outOfStock' },
  ]);

  // Filtrar productos por término de búsqueda y filtros activos
  const filteredProducts = products.filter(product => {
    // Filtro por texto
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado
    const matchesStatus = 
      (product.status === 'inStock' && activeFilters.inStock) ||
      (product.status === 'lowStock' && activeFilters.lowStock) ||
      (product.status === 'outOfStock' && activeFilters.outOfStock);
    
    // Filtro por categoría
    const matchesCategory = 
      (product.category === 'Alimentos' && activeFilters.alimentos) ||
      (product.category === 'Medicamentos' && activeFilters.medicamentos) ||
      (product.category === 'Higiene' && activeFilters.higiene) ||
      (product.category === 'Accesorios' && activeFilters.accesorios);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Función para obtener la variante del estado del producto
  const getStockVariant = (status) => {
    switch (status) {
      case 'inStock': return 'success';
      case 'lowStock': return 'secondary';
      case 'outOfStock': return 'destructive';
      default: return 'outline';
    }
  };

  // Función para obtener el texto del estado del producto
  const getStockText = (status) => {
    switch (status) {
      case 'inStock': return 'En stock';
      case 'lowStock': return 'Stock bajo';
      case 'outOfStock': return 'Agotado';
      default: return 'Desconocido';
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (filter, checked) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: checked
    }));
  };

  // Manejar edición de producto
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setIsEditDialogOpen(true);
  };

  // Manejar restock de producto
  const handleRestockClick = (product) => {
    setSelectedProduct(product);
    setRestockAmount('');
    setIsRestockDialogOpen(true);
  };

  // Guardar nuevo producto
  const handleSaveNewProduct = () => {
    // Validar que todos los campos estén completos
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock);

    // Validar que price y stock sean números válidos
    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      toast({
        title: "Error",
        description: "Precio y stock deben ser números válidos",
        variant: "destructive"
      });
      return;
    }

    // Determinar el status basado en el stock
    let status = 'inStock';
    if (stock === 0) {
      status = 'outOfStock';
    } else if (stock <= 10) {
      status = 'lowStock';
    }

    // Crear nuevo producto
    const newProductObj = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      price: price,
      stock: stock,
      status: status
    };

    // Agregar a la lista de productos
    setProducts([...products, newProductObj]);
    
    // Cerrar diálogo y mostrar mensaje
    setIsNewProductDialogOpen(false);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
    
    toast({
      title: "Producto creado",
      description: `${newProductObj.name} ha sido añadido a la lista de productos.`
    });
  };

  // Guardar cambios de producto editado
  const handleSaveEditedProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock);

    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      toast({
        title: "Error",
        description: "Precio y stock deben ser números válidos",
        variant: "destructive"
      });
      return;
    }

    // Determinar el status basado en el stock
    let status = 'inStock';
    if (stock === 0) {
      status = 'outOfStock';
    } else if (stock <= 10) {
      status = 'lowStock';
    }

    // Actualizar el producto
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          name: newProduct.name,
          category: newProduct.category,
          price: price,
          stock: stock,
          status: status
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Producto actualizado",
      description: `${newProduct.name} ha sido actualizado correctamente.`
    });
  };

  // Manejar restock de producto
  const handleSaveRestock = () => {
    const amount = parseInt(restockAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número positivo",
        variant: "destructive"
      });
      return;
    }

    // Actualizar el stock del producto
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const newStock = p.stock + amount;
        let status = 'inStock';
        if (newStock === 0) {
          status = 'outOfStock';
        } else if (newStock <= 10) {
          status = 'lowStock';
        }
        
        return {
          ...p,
          stock: newStock,
          status: status
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsRestockDialogOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Stock actualizado",
      description: `Se han añadido ${amount} unidades al producto ${selectedProduct.name}.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsNewProductDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Estado</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inStock" 
                    checked={activeFilters.inStock}
                    onCheckedChange={(checked) => handleFilterChange('inStock', checked)} 
                  />
                  <Label htmlFor="inStock">En stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="lowStock" 
                    checked={activeFilters.lowStock}
                    onCheckedChange={(checked) => handleFilterChange('lowStock', checked)} 
                  />
                  <Label htmlFor="lowStock">Stock bajo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="outOfStock" 
                    checked={activeFilters.outOfStock}
                    onCheckedChange={(checked) => handleFilterChange('outOfStock', checked)} 
                  />
                  <Label htmlFor="outOfStock">Agotado</Label>
                </div>
              </div>

              <h4 className="font-medium leading-none pt-2 border-t">Categoría</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="alimentos" 
                    checked={activeFilters.alimentos}
                    onCheckedChange={(checked) => handleFilterChange('alimentos', checked)} 
                  />
                  <Label htmlFor="alimentos">Alimentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="medicamentos" 
                    checked={activeFilters.medicamentos}
                    onCheckedChange={(checked) => handleFilterChange('medicamentos', checked)} 
                  />
                  <Label htmlFor="medicamentos">Medicamentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="higiene" 
                    checked={activeFilters.higiene}
                    onCheckedChange={(checked) => handleFilterChange('higiene', checked)} 
                  />
                  <Label htmlFor="higiene">Higiene</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="accesorios" 
                    checked={activeFilters.accesorios}
                    onCheckedChange={(checked) => handleFilterChange('accesorios', checked)} 
                  />
                  <Label htmlFor="accesorios">Accesorios</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <Card key={product.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {product.name}
                  </CardTitle>
                  <ExtendedBadge variant={getStockVariant(product.status)}>
                    {getStockText(product.status)}
                  </ExtendedBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span>{product.stock} unidades</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditClick(product)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleRestockClick(product)}
                      disabled={product.status === 'inStock' && product.stock > 40}
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <ExtendedBadge variant={getStockVariant(product.status)}>
                        {getStockText(product.status)}
                      </ExtendedBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestockClick(product)}
                          disabled={product.status === 'inStock' && product.stock > 40}
                        >
                          Restock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog para nuevo producto */}
      <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                onValueChange={(value) => setNewProduct({...newProduct, category: value})}
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
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
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
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProductDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewProduct}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar producto */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifique los campos para actualizar el producto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre del producto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoría</Label>
                <Select
                  onValueChange={(value) => setNewProduct({...newProduct, category: value})}
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
                <Label htmlFor="edit-price">Precio ($)</Label>
                <Input
                  id="edit-price"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock (unidades)</Label>
                <Input
                  id="edit-stock"
                  placeholder="0"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEditedProduct}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para restock */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restock de Producto</DialogTitle>
            <DialogDescription>
              {selectedProduct && `Añada más unidades de ${selectedProduct.name} al inventario`}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
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
                  onChange={(e) => setRestockAmount(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRestock}>Confirmar Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
