import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductSearch } from '@/components/products/ProductSearch';
import { NewProductDialog } from '@/components/products/dialogs/NewProductDialog';
import { EditProductDialog } from '@/components/products/dialogs/EditProductDialog';
import { RestockDialog } from '@/components/products/dialogs/RestockDialog';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const isMobile = useIsMobile();
  const {
    products,
    searchTerm,
    setSearchTerm,
    activeFilters,
    handleFilterChange,
    getStockVariant,
    getStockText,
    isNewProductDialogOpen,
    setIsNewProductDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isRestockDialogOpen,
    setIsRestockDialogOpen,
    selectedProduct,
    newProduct,
    handleNewProductChange,
    handleEditClick,
    handleRestockClick,
    handleSaveNewProduct,
    handleSaveEditedProduct,
    restockAmount,
    setRestockAmount,
    handleSaveRestock,
  } = useProducts();

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl animate-fade-in pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Productos</h1>
        <Button 
          className="flex items-center gap-2 w-full sm:w-auto" 
          onClick={() => setIsNewProductDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>
      
      <ProductSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      
      {isMobile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              getStockVariant={getStockVariant}
              getStockText={getStockText}
              onEdit={handleEditClick}
              onRestock={handleRestockClick}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <ProductTable 
                products={products} 
                getStockVariant={getStockVariant}
                getStockText={getStockText}
                onEdit={handleEditClick}
                onRestock={handleRestockClick}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <NewProductDialog 
        isOpen={isNewProductDialogOpen}
        onOpenChange={setIsNewProductDialogOpen}
        newProduct={newProduct}
        onNewProductChange={handleNewProductChange}
        onSave={handleSaveNewProduct}
      />

      <EditProductDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProduct={selectedProduct}
        productData={newProduct}
        onProductDataChange={handleNewProductChange}
        onSave={handleSaveEditedProduct}
      />

      <RestockDialog 
        isOpen={isRestockDialogOpen}
        onOpenChange={setIsRestockDialogOpen}
        selectedProduct={selectedProduct}
        restockAmount={restockAmount}
        onRestockAmountChange={setRestockAmount}
        onSave={handleSaveRestock}
      />
    </div>
  );
};

export default Products;
