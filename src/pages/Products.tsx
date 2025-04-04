
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Search, Plus, Package, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Datos de prueba para productos
  const products = [
    { id: 1, name: 'Alimento para perros Premium', category: 'Alimentos', price: 25.99, stock: 45, status: 'inStock' },
    { id: 2, name: 'Antiparasitario canino', category: 'Medicamentos', price: 15.50, stock: 32, status: 'inStock' },
    { id: 3, name: 'Champú hipoalergénico', category: 'Higiene', price: 12.75, stock: 18, status: 'inStock' },
    { id: 4, name: 'Juguete masticable para perros', category: 'Accesorios', price: 8.99, stock: 7, status: 'lowStock' },
    { id: 5, name: 'Arena para gatos', category: 'Higiene', price: 10.25, stock: 0, status: 'outOfStock' },
  ];

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener la variante del estado del producto
  const getStockVariant = (status: string) => {
    switch (status) {
      case 'inStock': return 'success';
      case 'lowStock': return 'secondary';
      case 'outOfStock': return 'destructive';
      default: return 'outline';
    }
  };

  // Función para obtener el texto del estado del producto
  const getStockText = (status: string) => {
    switch (status) {
      case 'inStock': return 'En stock';
      case 'lowStock': return 'Stock bajo';
      case 'outOfStock': return 'Agotado';
      default: return 'Desconocido';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <Button className="flex items-center gap-2">
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
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtrar
        </Button>
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
                    <Button variant="outline" className="flex-1">Editar</Button>
                    <Button variant="outline" className="flex-1">Restock</Button>
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
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Restock</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Products;
