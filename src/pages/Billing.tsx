
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Invoice, InvoiceItem, Payment, User, Pet, Product, Service } from '@/types';
import { invoices, payments } from '@/data/invoiceData';
import { users, pets, products, services } from '@/data/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Filter, FileText, CreditCard, DollarSign, Receipt, Plus, Printer, Send, AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Format currency to MXN
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Format date to Spanish locale
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'PPP', { locale: es });
};

// Color and icon for invoice status
const getInvoiceStatusDisplay = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return {
        color: 'success',
        text: 'Pagada',
        icon: <CheckCircle className="h-4 w-4" />
      };
    case 'overdue':
      return {
        color: 'destructive',
        text: 'Vencida',
        icon: <AlertCircle className="h-4 w-4" />
      };
    case 'pending':
      return {
        color: 'secondary',
        text: 'Pendiente',
        icon: <Clock className="h-4 w-4" />
      };
    case 'cancelled':
      return {
        color: 'outline',
        text: 'Cancelada',
        icon: <AlertCircle className="h-4 w-4" />
      };
    default:
      return {
        color: 'secondary',
        text: status,
        icon: null
      };
  }
};

// Form schema for new invoice
const newInvoiceSchema = z.object({
  clientId: z.string().min(1, { message: "Debe seleccionar un cliente" }),
  petId: z.string().optional(),
  dueDate: z.string().min(1, { message: "Debe seleccionar una fecha de vencimiento" }),
});

// Form schema for payment
const newPaymentSchema = z.object({
  amount: z.string().min(1, { message: "Debe ingresar un monto" }),
  method: z.enum(['cash', 'credit_card', 'debit_card', 'transfer', 'other'], {
    errorMap: () => ({ message: "Debe seleccionar un método de pago" }),
  }),
  reference: z.string().optional(),
});

// Helper to get client name from clientId
const getClientName = (clientId: string) => {
  const client = users.find(user => user.id === clientId);
  return client ? client.name : 'Cliente desconocido';
};

// Helper to get pet name from petId
const getPetName = (petId?: string) => {
  if (!petId) return 'N/A';
  const pet = pets.find(pet => pet.id === petId);
  return pet ? pet.name : 'Mascota desconocida';
};

const Billing = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [newInvoiceItems, setNewInvoiceItems] = useState<Partial<InvoiceItem>[]>([]);
  
  const clients = users.filter(user => user.role === 'client');
  const sortedInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedPayments = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Filter invoices based on search term and status filter
  const filteredInvoices = sortedInvoices.filter(invoice => {
    const clientName = getClientName(invoice.clientId).toLowerCase();
    const invoiceId = invoice.id.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                          clientName.includes(searchTerm.toLowerCase()) || 
                          invoiceId.includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  // Filter payments
  const filteredPayments = sortedPayments.filter(payment => {
    if (searchTerm === '') return true;
    
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    if (!invoice) return false;
    
    const clientName = getClientName(invoice.clientId).toLowerCase();
    const paymentId = payment.id.toLowerCase();
    const invoiceId = payment.invoiceId.toLowerCase();
    
    return clientName.includes(searchTerm.toLowerCase()) || 
           paymentId.includes(searchTerm.toLowerCase()) ||
           invoiceId.includes(searchTerm.toLowerCase());
  });

  const invoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      clientId: "",
      petId: "",
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const paymentForm = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: {
      amount: "",
      method: "cash",
      reference: "",
    },
  });

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const handleOpenCreateInvoice = () => {
    invoiceForm.reset();
    setNewInvoiceItems([]);
    setShowCreateInvoice(true);
  };

  const handleProcessPayment = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    paymentForm.setValue("amount", invoice.total.toString());
    setShowPaymentDialog(true);
  };

  const handleAddInvoiceItem = () => {
    setNewInvoiceItems([
      ...newInvoiceItems,
      {
        type: 'product',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setNewInvoiceItems(newInvoiceItems.filter((_, i) => i !== index));
  };

  const handleInvoiceItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...newInvoiceItems];
    
    if (field === 'itemId') {
      // Find the selected product or service
      const type = updatedItems[index].type as 'product' | 'service';
      const items = type === 'product' ? products : services;
      const selectedItem = items.find(item => item.id === value);
      
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemId: value,
          description: selectedItem.name,
          unitPrice: selectedItem.price,
          total: (updatedItems[index].quantity || 1) * selectedItem.price,
        };
      }
    } else if (field === 'type') {
      updatedItems[index] = {
        ...updatedItems[index],
        type: value,
        itemId: undefined,
        description: '',
        unitPrice: 0,
        total: 0,
      };
    } else if (field === 'quantity') {
      const quantity = parseInt(value) || 0;
      const unitPrice = updatedItems[index].unitPrice || 0;
      updatedItems[index] = {
        ...updatedItems[index],
        quantity,
        total: quantity * unitPrice,
      };
    } else if (field === 'unitPrice') {
      const unitPrice = parseFloat(value) || 0;
      const quantity = updatedItems[index].quantity || 1;
      updatedItems[index] = {
        ...updatedItems[index],
        unitPrice,
        total: quantity * unitPrice,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }
    
    setNewInvoiceItems(updatedItems);
  };

  const calculateNewInvoiceTotal = () => {
    const subtotal = newInvoiceItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmitInvoice = (data: z.infer<typeof newInvoiceSchema>) => {
    if (newInvoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un producto o servicio a la factura",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a new invoice with the form data
    const invoiceDate = new Date().toISOString().split('T')[0];
    const invoiceId = `inv-${Date.now()}`;
    const { subtotal, tax, total } = calculateNewInvoiceTotal();
    
    // Create invoice items with proper IDs
    const items = newInvoiceItems.map((item, index) => ({
      id: `item-${invoiceId}-${index}`,
      invoiceId,
      type: item.type || 'product',
      itemId: item.itemId,
      description: item.description || '',
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      total: item.total || 0,
    })) as InvoiceItem[];
    
    // Create new invoice
    const newInvoice: Invoice = {
      id: invoiceId,
      clientId: data.clientId,
      petId: data.petId || undefined,
      date: invoiceDate,
      dueDate: data.dueDate,
      status: 'pending',
      subtotal,
      tax,
      total,
      items,
    };
    
    // Add the invoice to our list (in a real app, this would be an API call)
    invoices.unshift(newInvoice);
    
    toast({
      title: "Factura creada",
      description: `Factura #${newInvoice.id} creada con éxito`,
    });
    
    setShowCreateInvoice(false);
  };

  const handleSubmitPayment = (data: z.infer<typeof newPaymentSchema>) => {
    if (!currentInvoice) return;
    
    // Create a new payment
    const paymentId = `pay-${Date.now()}`;
    const paymentDate = new Date().toISOString().split('T')[0];
    
    const newPayment: Payment = {
      id: paymentId,
      invoiceId: currentInvoice.id,
      date: paymentDate,
      amount: parseFloat(data.amount),
      method: data.method,
      status: 'completed',
      reference: data.reference,
    };
    
    // Update the invoice status
    const invoiceIndex = invoices.findIndex(inv => inv.id === currentInvoice.id);
    if (invoiceIndex !== -1) {
      invoices[invoiceIndex] = {
        ...invoices[invoiceIndex],
        status: 'paid',
        paymentId,
      };
    }
    
    // Add the payment to our list
    payments.unshift(newPayment);
    
    toast({
      title: "Pago registrado",
      description: `Pago de ${formatCurrency(parseFloat(data.amount))} registrado con éxito`,
      variant: "success",
    });
    
    setShowPaymentDialog(false);
  };

  const handlePrintInvoice = () => {
    toast({
      title: "Imprimiendo factura",
      description: "La factura se está enviando a la impresora",
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Enviando factura",
      description: "La factura se está enviando por correo electrónico",
    });
  };
  
  // Render invoice status badge
  const renderStatusBadge = (status: Invoice['status']) => {
    const statusInfo = getInvoiceStatusDisplay(status);
    return (
      <Badge variant={statusInfo.color as any} className="flex items-center gap-1">
        {statusInfo.icon}
        {statusInfo.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
          <p className="text-sm text-muted-foreground">
            Gestione facturas y pagos de la clínica veterinaria
          </p>
        </div>

        <Button onClick={handleOpenCreateInvoice}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Factura
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Facturas</span>
            <span className="inline sm:hidden">Fact.</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagos</span>
            <span className="inline sm:hidden">Pagos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>Lista de todas las facturas generadas</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente o # de factura..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagada</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]"># Factura</TableHead>
                      <TableHead className="hidden md:table-cell">Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha</TableHead>
                      <TableHead className="hidden sm:table-cell">Vencimiento</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No se encontraron facturas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getClientName(invoice.clientId)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(invoice.date)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {formatDate(invoice.dueDate)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(invoice.total)}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Ver</span>
                              </Button>
                              {invoice.status === 'pending' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleProcessPayment(invoice)}
                                >
                                  <DollarSign className="h-4 w-4" />
                                  <span className="sr-only">Pagar</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Pagos</CardTitle>
              <CardDescription>Historial de pagos recibidos</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente o # de pago..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]"># Pago</TableHead>
                      <TableHead className="hidden md:table-cell"># Factura</TableHead>
                      <TableHead className="hidden md:table-cell">Cliente</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="hidden sm:table-cell">Método</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No se encontraron pagos
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => {
                        const relatedInvoice = invoices.find(inv => inv.id === payment.invoiceId);
                        const clientName = relatedInvoice 
                          ? getClientName(relatedInvoice.clientId) 
                          : 'Desconocido';
                          
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell className="hidden md:table-cell">{payment.invoiceId}</TableCell>
                            <TableCell className="hidden md:table-cell">{clientName}</TableCell>
                            <TableCell className="hidden sm:table-cell">{formatDate(payment.date)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell capitalize">
                              {payment.method === 'credit_card' 
                                ? 'Tarjeta de crédito' 
                                : payment.method === 'debit_card'
                                  ? 'Tarjeta de débito'
                                  : payment.method === 'transfer'
                                    ? 'Transferencia'
                                    : payment.method === 'cash'
                                      ? 'Efectivo'
                                      : payment.method}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (relatedInvoice) {
                                    handleViewInvoice(relatedInvoice);
                                  }
                                }}
                              >
                                <Receipt className="h-4 w-4" />
                                <span className="sr-only">Ver factura</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Factura</DialogTitle>
            <DialogDescription>
              Información detallada de la factura
            </DialogDescription>
          </DialogHeader>
          
          {currentInvoice && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-bold text-lg"># {currentInvoice.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Estado: {renderStatusBadge(currentInvoice.status)}
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-sm">Fecha: {formatDate(currentInvoice.date)}</p>
                  <p className="text-sm">Vencimiento: {formatDate(currentInvoice.dueDate)}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">CLIENTE</h4>
                    <p>{getClientName(currentInvoice.clientId)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">MASCOTA</h4>
                    <p>{getPetName(currentInvoice.petId)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Productos y Servicios</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(currentInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (16%):</span>
                  <span>{formatCurrency(currentInvoice.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(currentInvoice.total)}</span>
                </div>
              </div>
              
              {/* Payment information if paid */}
              {currentInvoice.status === 'paid' && currentInvoice.paymentId && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Información de Pago</h4>
                  {payments
                    .filter(payment => payment.id === currentInvoice.paymentId)
                    .map(payment => (
                      <div key={payment.id} className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de pago</p>
                          <p>{formatDate(payment.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Método</p>
                          <p className="capitalize">
                            {payment.method === 'credit_card' 
                              ? 'Tarjeta de crédito' 
                              : payment.method === 'debit_card'
                                ? 'Tarjeta de débito'
                                : payment.method === 'transfer'
                                  ? 'Transferencia'
                                  : payment.method === 'cash'
                                    ? 'Efectivo'
                                    : payment.method}
                          </p>
                        </div>
                        {payment.reference && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Referencia</p>
                            <p>{payment.reference}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrintInvoice} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleSendInvoice} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
            {currentInvoice && currentInvoice.status === 'pending' && (
              <Button variant="success" onClick={() => {
                setShowInvoiceDetails(false);
                handleProcessPayment(currentInvoice);
              }} className="w-full sm:w-auto">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Invoice Dialog */}
      <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Factura</DialogTitle>
            <DialogDescription>
              Cree una nueva factura para un cliente
            </DialogDescription>
          </DialogHeader>
          
          <Form {...invoiceForm}>
            <form onSubmit={invoiceForm.handleSubmit(handleSubmitInvoice)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={invoiceForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={invoiceForm.control}
                  name="petId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mascota (opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una mascota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Ninguna</SelectItem>
                          {pets
                            .filter(pet => {
                              const clientId = invoiceForm.watch("clientId");
                              return clientId ? pet.ownerId === clientId : true;
                            })
                            .map((pet) => (
                              <SelectItem key={pet.id} value={pet.id}>
                                {pet.name} ({pet.species})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={invoiceForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de vencimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Productos y Servicios</h4>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddInvoiceItem}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar Ítem
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {newInvoiceItems.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No hay ítems agregados. Haga clic en "Agregar Ítem" para comenzar.
                    </p>
                  )}
                  
                  {newInvoiceItems.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tipo</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) => handleInvoiceItemChange(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="product">Producto</SelectItem>
                              <SelectItem value="service">Servicio</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {item.type !== 'other' && (
                          <div>
                            <Label>{item.type === 'product' ? 'Producto' : 'Servicio'}</Label>
                            <Select
                              value={item.itemId}
                              onValueChange={(value) => handleInvoiceItemChange(index, 'itemId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Seleccione un ${item.type === 'product' ? 'producto' : 'servicio'}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {(item.type === 'product' ? products : services).map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name} - {formatCurrency(item.price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {item.type === 'other' && (
                          <div>
                            <Label>Descripción</Label>
                            <Input
                              value={item.description || ''}
                              onChange={(e) => handleInvoiceItemChange(index, 'description', e.target.value)}
                              placeholder="Descripción del ítem"
                            />
                          </div>
                        )}
                        
                        <div>
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleInvoiceItemChange(index, 'quantity', e.target.value)}
                          />
                        </div>
                        
                        {item.type === 'other' && (
                          <div>
                            <Label>Precio unitario</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleInvoiceItemChange(index, 'unitPrice', e.target.value)}
                            />
                          </div>
                        )}
                        
                        <div className="col-span-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total: {formatCurrency(item.total || 0)}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveInvoiceItem(index)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Invoice summary */}
              {newInvoiceItems.length > 0 && (
                <div className="border-t pt-4">
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(calculateNewInvoiceTotal().subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (16%):</span>
                      <span>{formatCurrency(calculateNewInvoiceTotal().tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateNewInvoiceTotal().total)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowCreateInvoice(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Factura</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Process Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              Complete la información del pago
            </DialogDescription>
          </DialogHeader>
          
          {currentInvoice && (
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(handleSubmitPayment)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Detalles de la factura</h4>
                    <p>Cliente: {getClientName(currentInvoice.clientId)}</p>
                    <p>Fecha: {formatDate(currentInvoice.date)}</p>
                    <p>Total a pagar: {formatCurrency(currentInvoice.total)}</p>
                  </div>
                  
                  <FormField
                    control={paymentForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="credit_card">Tarjeta de crédito</SelectItem>
                            <SelectItem value="debit_card">Tarjeta de débito</SelectItem>
                            <SelectItem value="transfer">Transferencia</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {paymentForm.watch("method") !== 'cash' && (
                    <FormField
                      control={paymentForm.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referencia</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Número de autorización o referencia" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setShowPaymentDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="success">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Registrar Pago
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
