
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Stethoscope, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Estados para diálogos
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Estados para el nuevo servicio
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration: '',
    price: ''
  });

  // Estado para programar cita
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    petName: '',
    ownerName: '',
    notes: ''
  });

  // Datos de prueba para servicios
  const [services, setServices] = useState([
    { id: 1, name: 'Consulta general', description: 'Examen físico general y diagnóstico', duration: 30, price: 35.00 },
    { id: 2, name: 'Vacunación', description: 'Administración de vacunas según calendario', duration: 15, price: 25.00 },
    { id: 3, name: 'Cirugía menor', description: 'Procedimientos quirúrgicos menores', duration: 60, price: 120.00 },
    { id: 4, name: 'Limpieza dental', description: 'Eliminación de sarro y limpieza completa', duration: 45, price: 80.00 },
    { id: 5, name: 'Análisis de sangre', description: 'Análisis completo de sangre', duration: 20, price: 45.00 },
  ]);

  // Filtrar servicios por término de búsqueda
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar creación de nuevo servicio
  const handleSaveNewService = () => {
    // Validar campos
    if (!serviceForm.name || !serviceForm.description || !serviceForm.duration || !serviceForm.price) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const duration = parseInt(serviceForm.duration);
    const price = parseFloat(serviceForm.price);

    // Validar valores numéricos
    if (isNaN(duration) || isNaN(price) || duration <= 0 || price <= 0) {
      toast({
        title: "Error",
        description: "Duración y precio deben ser valores numéricos positivos",
        variant: "destructive"
      });
      return;
    }

    // Crear nuevo servicio
    const newService = {
      id: services.length + 1,
      name: serviceForm.name,
      description: serviceForm.description,
      duration: duration,
      price: price
    };

    // Actualizar lista de servicios
    setServices([...services, newService]);
    setIsNewServiceDialogOpen(false);
    setServiceForm({ name: '', description: '', duration: '', price: '' });
    
    toast({
      title: "Servicio creado",
      description: `${newService.name} ha sido añadido a la lista de servicios.`
    });
  };

  // Manejar edición de servicio
  const handleEditClick = (service) => {
    setSelectedService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString()
    });
    setIsEditDialogOpen(true);
  };

  // Guardar cambios de servicio editado
  const handleSaveEditedService = () => {
    // Validar campos
    if (!serviceForm.name || !serviceForm.description || !serviceForm.duration || !serviceForm.price) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const duration = parseInt(serviceForm.duration);
    const price = parseFloat(serviceForm.price);

    // Validar valores numéricos
    if (isNaN(duration) || isNaN(price) || duration <= 0 || price <= 0) {
      toast({
        title: "Error",
        description: "Duración y precio deben ser valores numéricos positivos",
        variant: "destructive"
      });
      return;
    }

    // Actualizar el servicio
    const updatedServices = services.map(s => {
      if (s.id === selectedService.id) {
        return {
          ...s,
          name: serviceForm.name,
          description: serviceForm.description,
          duration: duration,
          price: price
        };
      }
      return s;
    });

    setServices(updatedServices);
    setIsEditDialogOpen(false);
    setSelectedService(null);
    
    toast({
      title: "Servicio actualizado",
      description: `${serviceForm.name} ha sido actualizado correctamente.`
    });
  };

  // Manejar programar servicio
  const handleScheduleClick = (service) => {
    setSelectedService(service);
    setScheduleForm({
      date: '',
      time: '',
      petName: '',
      ownerName: '',
      notes: ''
    });
    setIsScheduleDialogOpen(true);
  };

  // Guardar nueva cita programada
  const handleSaveSchedule = () => {
    // Validar campos obligatorios
    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.petName || !scheduleForm.ownerName) {
      toast({
        title: "Error",
        description: "Fecha, hora, mascota y propietario son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Aquí se guardaría la cita en la base de datos
    setIsScheduleDialogOpen(false);
    setSelectedService(null);
    
    toast({
      title: "Cita programada",
      description: `Se ha programado el servicio de ${selectedService.name} para ${scheduleForm.petName} el ${new Date(scheduleForm.date).toLocaleDateString('es-ES')} a las ${scheduleForm.time}.`
    });
  };

  // Obtener la fecha actual en formato YYYY-MM-DD para el input de fecha
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsNewServiceDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo Servicio
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredServices.map(service => (
            <Card key={service.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span>{service.duration} minutos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditClick(service)}
                    >
                      Editar
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleScheduleClick(service)}
                    >
                      Agendar
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map(service => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        {service.name}
                      </div>
                    </TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.duration} minutos</TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(service)}
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleScheduleClick(service)}
                        >
                          Agendar
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

      {/* Dialog para nuevo servicio */}
      <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Servicio</DialogTitle>
            <DialogDescription>
              Complete los campos para agregar un nuevo servicio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre del servicio"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del servicio"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Input
                id="duration"
                placeholder="30"
                type="number"
                min="1"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewServiceDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewService}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar servicio */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Modifique los campos para actualizar el servicio
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre del servicio"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Descripción del servicio"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duración (minutos)</Label>
                <Input
                  id="edit-duration"
                  placeholder="30"
                  type="number"
                  min="1"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Precio ($)</Label>
                <Input
                  id="edit-price"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEditedService}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para agendar servicio */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Servicio</DialogTitle>
            <DialogDescription>
              {selectedService && `Programar una cita para el servicio: ${selectedService.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Fecha</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  min={getTodayDate()}
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">Hora</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-pet">Mascota</Label>
                <Input
                  id="schedule-pet"
                  placeholder="Nombre de la mascota"
                  value={scheduleForm.petName}
                  onChange={(e) => setScheduleForm({...scheduleForm, petName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-owner">Propietario</Label>
                <Input
                  id="schedule-owner"
                  placeholder="Nombre del propietario"
                  value={scheduleForm.ownerName}
                  onChange={(e) => setScheduleForm({...scheduleForm, ownerName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-notes">Notas (opcional)</Label>
                <Textarea
                  id="schedule-notes"
                  placeholder="Notas adicionales para la cita"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="bg-muted rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Duración:</span>
                  <span className="text-sm font-medium">{selectedService.duration} minutos</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm">Precio:</span>
                  <span className="text-sm font-medium">${selectedService.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSchedule} className="gap-2">
              <Calendar className="h-4 w-4" /> Agendar Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
