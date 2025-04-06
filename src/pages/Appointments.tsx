
import React, { useState } from 'react';
import { Calendar, Clock, FileText, Check, X, DollarSign } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import { PawIcon } from '@/components/icons/PawIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { appointments as mockAppointments, pets as mockPets, users as mockUsers } from '@/data/mockData';
import { Appointment, Pet } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Appointments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const availablePets = currentUser?.role === 'client' 
    ? mockPets.filter(pet => pet.ownerId === currentUser.id)
    : mockPets;
  
  const veterinarians = mockUsers.filter(user => user.role === 'veterinarian');

  const filteredAppointments = appointments.filter(appointment => {
    let roleFilter = true;
    
    if (currentUser?.role === 'veterinarian') {
      roleFilter = appointment.veterinarianId === currentUser.id;
    } else if (currentUser?.role === 'client') {
      const userPets = availablePets.map(pet => pet.id);
      roleFilter = userPets.includes(appointment.petId);
    }
    
    const dateFilter = selectedDate ? appointment.date === selectedDate : true;
    
    return roleFilter && dateFilter;
  });

  const getPetName = (petId: string): string => {
    const pet = mockPets.find(pet => pet.id === petId);
    return pet ? pet.name : 'Mascota no encontrada';
  };

  const getPetOwnerName = (petId: string): string => {
    const pet = mockPets.find(pet => pet.id === petId);
    if (pet) {
      const owner = mockUsers.find(user => user.id === pet.ownerId);
      return owner ? owner.name : 'Propietario no encontrado';
    }
    return 'Propietario no encontrado';
  };

  const getVeterinarianName = (vetId: string): string => {
    const vet = mockUsers.find(user => user.id === vetId);
    return vet ? vet.name : 'Veterinario no encontrado';
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    ));
    
    toast({
      title: 'Estado de cita actualizado',
      description: `La cita ha sido marcada como ${newStatus === 'scheduled' ? 'programada' : newStatus === 'completed' ? 'completada' : 'cancelada'}.`,
    });
  };

  const handleCreateAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAppointment: Appointment = {
      id: `${appointments.length + 1}`,
      petId: formData.get('pet') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      reason: formData.get('reason') as string,
      status: 'scheduled',
      veterinarianId: formData.get('veterinarian') as string,
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsDialogOpen(false);
    
    toast({
      title: 'Cita creada',
      description: `Se ha programado una cita para ${getPetName(newAppointment.petId)} el ${newAppointment.date} a las ${newAppointment.time}.`,
    });
  };
  
  // Esquema para la validación del formulario de consulta
  const consultationSchema = z.object({
    diagnosis: z.string().min(3, "El diagnóstico es requerido"),
    treatment: z.string().min(3, "El tratamiento es requerido"),
    observations: z.string().optional(),
    cost: z.string().min(1, "El costo es requerido"),
    createInvoice: z.boolean().default(false),
  });

  // Tipo para los datos del formulario
  type ConsultationFormValues = z.infer<typeof consultationSchema>;

  // Formulario para el registro de consulta
  const consultationForm = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      diagnosis: "",
      treatment: "",
      observations: "",
      cost: "",
      createInvoice: false,
    },
  });
  
  // Manejar el envío del formulario de consulta
  const handleConsultationSubmit = (data: ConsultationFormValues) => {
    if (!selectedAppointment) return;
    
    // Actualizar el estado de la cita a completada
    handleStatusChange(selectedAppointment.id, 'completed');
    
    // Crear una factura si se seleccionó esa opción
    if (data.createInvoice) {
      // Aquí podríamos redirigir al usuario a la página de facturación o generar la factura automáticamente
      toast({
        title: 'Factura generada',
        description: `Se ha generado una factura por $${data.cost} para la consulta de ${getPetName(selectedAppointment.petId)}.`,
        variant: "success",
      });
    }
    
    // Registrar la consulta
    toast({
      title: 'Consulta registrada',
      description: `La consulta para ${getPetName(selectedAppointment.petId)} ha sido registrada exitosamente.`,
      variant: "success",
    });
    
    // Cerrar el diálogo
    setIsConsultationDialogOpen(false);
    setSelectedAppointment(null);
    consultationForm.reset();
  };

  // Abrir el diálogo para registrar una consulta
  const openConsultationDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsConsultationDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
        {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist' || currentUser?.role === 'client') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateAppointment}>
                <DialogHeader>
                  <DialogTitle>Programar Nueva Cita</DialogTitle>
                  <DialogDescription>
                    Complete el formulario para programar una nueva cita veterinaria.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pet">Mascota</Label>
                    <Select name="pet" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una mascota" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name} ({pet.species})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="veterinarian">Veterinario</Label>
                    <Select name="veterinarian" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un veterinario" />
                      </SelectTrigger>
                      <SelectContent>
                        {veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        type="date"
                        id="date"
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Hora</Label>
                      <Input
                        type="time"
                        id="time"
                        name="time"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Motivo de la consulta</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Describa el motivo de la consulta"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Programar Cita</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="date-filter">Filtrar por fecha</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  id="date-filter"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {selectedDate && (
                  <Button variant="outline" onClick={() => setSelectedDate('')}>
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">
                    {getPetName(appointment.petId)}
                  </CardTitle>
                  <ExtendedBadge 
                    variant={appointment.status === 'scheduled' ? 'default' : 
                           appointment.status === 'completed' ? 'success' : 'destructive'}
                  >
                    {appointment.status === 'scheduled' ? 'Programada' : 
                     appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </ExtendedBadge>
                </div>
                <CardDescription>
                  {appointment.reason}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{new Date(appointment.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                  {(currentUser?.role === 'admin' || currentUser?.role === 'veterinarian' || currentUser?.role === 'receptionist') && (
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{getPetOwnerName(appointment.petId)}</span>
                    </div>
                  )}
                  {currentUser?.role !== 'veterinarian' && (
                    <div className="flex items-center">
                      <PawIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Dr. {getVeterinarianName(appointment.veterinarianId)}</span>
                    </div>
                  )}
                </div>

                {appointment.status === 'scheduled' && (
                  <div className="flex gap-2 mt-4">
                    {(currentUser?.role === 'admin' || currentUser?.role === 'veterinarian') && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                      >
                        <Check className="h-4 w-4" />
                        Completar
                      </Button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist' || currentUser?.role === 'client') && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.role === 'veterinarian') && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1 ml-auto"
                        onClick={() => openConsultationDialog(appointment)}
                      >
                        <FileText className="h-4 w-4" />
                        Registrar consulta
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No hay citas disponibles</h3>
            <p className="text-muted-foreground mb-4">
              {selectedDate ? 'No hay citas programadas para la fecha seleccionada.' : 'No se encontraron citas que coincidan con los criterios de búsqueda.'}
            </p>
            {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist' || currentUser?.role === 'client') && (
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Programar una cita
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Diálogo para registrar consulta */}
      <Dialog open={isConsultationDialogOpen} onOpenChange={setIsConsultationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Consulta Médica</DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <p>Registre la consulta para <strong>{getPetName(selectedAppointment.petId)}</strong> del día <strong>{new Date(selectedAppointment.date).toLocaleDateString('es-ES')}</strong></p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...consultationForm}>
            <form onSubmit={consultationForm.handleSubmit(handleConsultationSubmit)} className="space-y-6">
              <FormField
                control={consultationForm.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese el diagnóstico médico" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={consultationForm.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tratamiento</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalle el tratamiento indicado" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={consultationForm.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observaciones adicionales" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={consultationForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo de la consulta</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            min="0"
                            step="0.01"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={consultationForm.control}
                  name="createInvoice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel>Generar factura</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsConsultationDialogOpen(false);
                    setSelectedAppointment(null);
                    consultationForm.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Consulta</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
