
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CheckIcon, CreditCard, Download, FileText, FilePen, Plus, Search, XCircleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pets as mockPets, services as mockServices, products as mockProducts, users as mockUsers } from '@/data/mockData';
import { invoices as mockInvoices, payments as mockPayments } from '@/data/invoiceData';
import { Invoice, Payment, Pet, UserRole } from '@/types';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { MonthlyReportCard } from '@/components/billing/MonthlyReportCard';
import { useAuth } from '@/contexts/AuthContext';

const Billing = () => {
  const { toast } = useToast();
  const { hasFeatureAccess } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditInvoiceDialogOpen, setIsEditInvoiceDialogOpen] = useState(false);
  
  const canCreateInvoices = hasFeatureAccess('billing_create');
  const canProcessPayments = hasFeatureAccess('billing_payment');

  const paymentSchema = z.object({
    amount: z.string().min(1, 'El monto es requerido'),
    method: z.enum(['cash', 'credit_card', 'debit_card', 'transfer'], {
      required_error: 'Por favor seleccione un método de pago',
    }),
    reference: z.string().optional(),
  });

  type PaymentFormValues = z.infer<typeof paymentSchema>;

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      method: 'cash',
      reference: '',
    },
  });

  const handlePaymentSubmit = (data: PaymentFormValues) => {
    if (!selectedInvoice) return;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId: selectedInvoice.id,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(data.amount),
      method: data.method,
      status: 'completed',
      reference: data.method !== 'cash' ? data.reference : undefined,
    };

    const updatedInvoices = invoices.map(invoice => 
      invoice.id === selectedInvoice.id 
        ? { 
            ...invoice, 
            status: 'paid' as const, 
            paymentId: newPayment.id 
          } 
        : invoice
    );

    setInvoices(updatedInvoices);
    setPayments([...payments, newPayment]);
    setIsAddPaymentDialogOpen(false);
    setSelectedInvoice(null);
    paymentForm.reset();

    toast({
      title: 'Pago registrado',
      description: `Se ha registrado un pago de $${data.amount} para la factura ${selectedInvoice.id}.`,
      variant: "success",
    });
  };

  const openAddPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    paymentForm.setValue('amount', invoice.total.toString());
    setIsAddPaymentDialogOpen(true);
  };

  // New function to handle invoice download
  const handleDownloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate a PDF or similar document
    toast({
      title: 'Descargando factura',
      description: `Descargando factura ${invoice.id} en PDF.`,
      variant: "default",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: 'Factura descargada',
        description: `La factura ${invoice.id} ha sido descargada exitosamente.`,
        variant: "success",
      });
    }, 1500);
  };

  // New function to edit invoice
  const openEditInvoiceDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditInvoiceDialogOpen(true);
    
    toast({
      title: 'Editar factura',
      description: `Editando factura ${invoice.id}.`,
      variant: "default",
    });
  };

  // New function to handle "Nueva Factura" button
  const openCreateInvoiceDialog = () => {
    setIsCreateInvoiceDialogOpen(true);
    setSelectedInvoice(null);
  };

  // Function to create a new invoice
  const handleCreateInvoice = () => {
    toast({
      title: 'Factura creada',
      description: `Se ha creado una nueva factura exitosamente.`,
      variant: "success",
    });
    setIsCreateInvoiceDialogOpen(false);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const searchMatch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPetName(invoice.petId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClientName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'all' ? true : invoice.status === statusFilter;
      
      return searchMatch && statusMatch;
    });
  }, [invoices, searchTerm, statusFilter]);

  const getPetName = (petId?: string): string => {
    if (!petId) return 'N/A';
    const pet = mockPets.find(pet => pet.id === petId);
    return pet ? pet.name : 'Mascota no encontrada';
  };

  const getClientName = (clientId: string): string => {
    const client = mockUsers.find(user => user.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const getPaymentInfo = (paymentId?: string): Payment | undefined => {
    if (!paymentId) return undefined;
    return payments.find(payment => payment.id === paymentId);
  };

  const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  const generateMonthlyReportData = () => {
    const year = new Date().getFullYear();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return months.map((month, index) => {
      const monthInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getMonth() === index && invoiceDate.getFullYear() === year;
      });

      const paid = monthInvoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      const pending = monthInvoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      const overdue = monthInvoices
        .filter(invoice => invoice.status === 'overdue')
        .reduce((sum, invoice) => sum + invoice.total, 0);

      const total = paid + pending + overdue;

      return {
        month,
        total,
        paid,
        pending,
        overdue
      };
    });
  };

  const monthlyReportData = generateMonthlyReportData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="reports">Reportes Mensuales</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Facturas</CardTitle>
                  {canCreateInvoices && (
                    <Button 
                      onClick={openCreateInvoiceDialog}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Factura
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Administre y supervise todas las facturas de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:justify-between md:space-x-4 mb-4 space-y-4 md:space-y-0">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por ID, cliente o mascota..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-52">
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="paid">Pagadas</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="overdue">Vencidas</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Mascota</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{getClientName(invoice.clientId)}</TableCell>
                            <TableCell>{invoice.petId ? getPetName(invoice.petId) : 'N/A'}</TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{currencyFormatter.format(invoice.total)}</TableCell>
                            <TableCell>
                              <ExtendedBadge variant={
                                invoice.status === 'paid' ? 'success' :
                                invoice.status === 'overdue' ? 'destructive' : 'outline'
                              }>
                                {invoice.status === 'paid' ? 'Pagada' :
                                 invoice.status === 'pending' ? 'Pendiente' :
                                 invoice.status === 'cancelled' ? 'Cancelada' : 'Vencida'}
                              </ExtendedBadge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDownloadInvoice(invoice)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                {invoice.status !== 'paid' && canProcessPayments && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openAddPaymentDialog(invoice)}
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                )}
                                {canCreateInvoices && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openEditInvoiceDialog(invoice)}
                                  >
                                    <FilePen className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No se encontraron facturas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-6">
            <MonthlyReportCard 
              data={monthlyReportData}
              year={new Date().getFullYear()}
            />
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Detalles de Ingresos Mensuales</CardTitle>
                <CardDescription>
                  Registros detallados de todas las transacciones por mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mes</TableHead>
                        <TableHead>Total Facturado</TableHead>
                        <TableHead>Pagado</TableHead>
                        <TableHead>Pendiente</TableHead>
                        <TableHead>Vencido</TableHead>
                        <TableHead>Tasa de Cobro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReportData.map((monthData, index) => {
                        const collectionRate = monthData.total > 0 
                          ? ((monthData.paid / monthData.total) * 100).toFixed(1) 
                          : '0.0';
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{monthData.month}</TableCell>
                            <TableCell>{currencyFormatter.format(monthData.total)}</TableCell>
                            <TableCell>{currencyFormatter.format(monthData.paid)}</TableCell>
                            <TableCell>{currencyFormatter.format(monthData.pending)}</TableCell>
                            <TableCell>{currencyFormatter.format(monthData.overdue)}</TableCell>
                            <TableCell>{collectionRate}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              {selectedInvoice && (
                <p>Registre el pago para la factura <strong>{selectedInvoice.id}</strong> de <strong>{currencyFormatter.format(selectedInvoice.total)}</strong></p>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2 top-2.5 text-sm text-muted-foreground">$</span>
                        <Input 
                          type="number"
                          step="0.01" 
                          min="0"
                          className="pl-6" 
                          {...field}
                        />
                      </div>
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentForm.watch("method") !== "cash" && (
                <FormField
                  control={paymentForm.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Número de autorización o referencia" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddPaymentDialogOpen(false);
                    setSelectedInvoice(null);
                    paymentForm.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Registrar Pago</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Nueva Factura Dialog */}
      <Dialog open={isCreateInvoiceDialogOpen} onOpenChange={setIsCreateInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Factura</DialogTitle>
            <DialogDescription>
              Complete los datos para crear una nueva factura
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select defaultValue="client-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter(user => user.role === 'client')
                      .map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet">Mascota</Label>
                <Select defaultValue="pet-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Elementos de la Factura</Label>
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Producto o Servicio</div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Agregar
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    No se han agregado elementos a esta factura
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateInvoiceDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateInvoice}>Crear Factura</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar Factura Dialog */}
      <Dialog open={isEditInvoiceDialogOpen} onOpenChange={setIsEditInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Factura</DialogTitle>
            <DialogDescription>
              {selectedInvoice && (
                <p>Modificando la factura <strong>{selectedInvoice.id}</strong></p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client">Cliente</Label>
                <Select defaultValue={selectedInvoice?.clientId || "client-1"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter(user => user.role === 'client')
                      .map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-pet">Mascota</Label>
                <Select defaultValue={selectedInvoice?.petId || "pet-1"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedInvoice && (
              <div className="space-y-2">
                <Label>Elementos de la Factura</Label>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="w-[100px]">Cantidad</TableHead>
                        <TableHead className="w-[100px]">Precio</TableHead>
                        <TableHead className="w-[100px]">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{currencyFormatter.format(item.unitPrice)}</TableCell>
                          <TableCell>{currencyFormatter.format(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditInvoiceDialogOpen(false);
                setSelectedInvoice(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: 'Factura actualizada',
                description: 'Los cambios han sido guardados correctamente.',
                variant: "success",
              });
              setIsEditInvoiceDialogOpen(false);
              setSelectedInvoice(null);
            }}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
