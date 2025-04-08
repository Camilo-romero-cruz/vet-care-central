
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

export const useProducts = () => {
  const { toast } = useToast();

  // Initial products data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Alimento para perros Premium', category: 'Alimentos', price: 25.99, stock: 45, status: 'inStock' },
    { id: 2, name: 'Antiparasitario canino', category: 'Medicamentos', price: 15.50, stock: 32, status: 'inStock' },
    { id: 3, name: 'Champú hipoalergénico', category: 'Higiene', price: 12.75, stock: 18, status: 'inStock' },
    { id: 4, name: 'Juguete masticable para perros', category: 'Accesorios', price: 8.99, stock: 7, status: 'lowStock' },
    { id: 5, name: 'Arena para gatos', category: 'Higiene', price: 10.25, stock: 0, status: 'outOfStock' },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    inStock: true,
    lowStock: true,
    outOfStock: true,
    alimentos: true,
    medicamentos: true,
    higiene: true,
    accesorios: true
  });

  // Dialog states
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [restockAmount, setRestockAmount] = useState('');

  // Helper functions
  const getStockVariant = (status: string): "success" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'inStock': return 'success';
      case 'lowStock': return 'secondary';
      case 'outOfStock': return 'destructive';
      default: return 'outline';
    }
  };

  const getStockText = (status: string): string => {
    switch (status) {
      case 'inStock': return 'En stock';
      case 'lowStock': return 'Stock bajo';
      case 'outOfStock': return 'Agotado';
      default: return 'Desconocido';
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    // Filter by text
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      (product.status === 'inStock' && activeFilters.inStock) ||
      (product.status === 'lowStock' && activeFilters.lowStock) ||
      (product.status === 'outOfStock' && activeFilters.outOfStock);
    
    // Filter by category
    const matchesCategory = 
      (product.category === 'Alimentos' && activeFilters.alimentos) ||
      (product.category === 'Medicamentos' && activeFilters.medicamentos) ||
      (product.category === 'Higiene' && activeFilters.higiene) ||
      (product.category === 'Accesorios' && activeFilters.accesorios);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Action handlers
  const handleFilterChange = (filter: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: checked
    }));
  };

  const handleNewProductChange = (field: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleRestockClick = (product: Product) => {
    setSelectedProduct(product);
    setRestockAmount('');
    setIsRestockDialogOpen(true);
  };

  const handleSaveNewProduct = () => {
    // Validate that all fields are complete
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

    // Validate that price and stock are valid numbers
    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      toast({
        title: "Error",
        description: "Precio y stock deben ser números válidos",
        variant: "destructive"
      });
      return;
    }

    // Determine status based on stock
    let status = 'inStock';
    if (stock === 0) {
      status = 'outOfStock';
    } else if (stock <= 10) {
      status = 'lowStock';
    }

    // Create new product
    const newProductObj = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      price: price,
      stock: stock,
      status: status
    };

    // Add to the list of products
    setProducts([...products, newProductObj]);
    
    // Close dialog and show message
    setIsNewProductDialogOpen(false);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
    
    toast({
      title: "Producto creado",
      description: `${newProductObj.name} ha sido añadido a la lista de productos.`
    });
  };

  const handleSaveEditedProduct = () => {
    if (!selectedProduct) return;

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

    // Determine status based on stock
    let status = 'inStock';
    if (stock === 0) {
      status = 'outOfStock';
    } else if (stock <= 10) {
      status = 'lowStock';
    }

    // Update the product
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

  const handleSaveRestock = () => {
    if (!selectedProduct) return;
    
    const amount = parseInt(restockAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número positivo",
        variant: "destructive"
      });
      return;
    }

    // Update the stock of the product
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

  return {
    products: filteredProducts,
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
  };
};
