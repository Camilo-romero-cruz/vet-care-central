
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, User, Mail, Phone, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Switch } from '@/components/ui/switch';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Estados para diálogos
  const [isNewStaffDialogOpen, setIsNewStaffDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Estado para el formulario
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    specialty: '',
    status: 'active'
  });

  // Días de la semana para el horario
  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Estado inicial para el horario
  const initialSchedule = weekdays.reduce((acc, day) => {
    acc[day.toLowerCase()] = { active: false, start: '08:00', end: '18:00' };
    return acc;
  }, {});
  
  // Estado para el horario
  const [scheduleForm, setScheduleForm] = useState(initialSchedule);

  // Datos de prueba para personal
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Dr. Roberto Méndez', role: 'veterinarian', email: 'roberto@vetcare.com', phone: '555-1234', specialty: 'Medicina general', status: 'active' },
    { id: 2, name: 'Dra. Laura Fernández', role: 'veterinarian', email: 'laura@vetcare.com', phone: '555-5678', specialty: 'Cirugía', status: 'active' },
    { id: 3, name: 'Ana Martínez', role: 'receptionist', email: 'ana@vetcare.com', phone: '555-9012', specialty: 'N/A', status: 'active' },
    { id: 4, name: 'Carlos Jiménez', role: 'receptionist', email: 'carlos@vetcare.com', phone: '555-3456', specialty: 'N/A', status: 'inactive' },
    { id: 5, name: 'Dra. Sofía Ruiz', role: 'veterinarian', email: 'sofia@vetcare.com', phone: '555-7890', specialty: 'Dermatología', status: 'active' },
  ]);

  // Filtrar personal por término de búsqueda
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre del rol en español
  const getRoleName = (role) => {
    switch (role) {
      case 'veterinarian': return 'Veterinario';
      case 'receptionist': return 'Recepcionista';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  // Manejar creación de nuevo miembro del personal
  const handleSaveNewStaff = () => {
    // Validar campos obligatorios
    if (!staffForm.name || !staffForm.role || !staffForm.email || !staffForm.phone) {
      toast({
        title: "Error",
        description: "Nombre, rol, email y teléfono son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Validar email básico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(staffForm.email)) {
      toast({
        title: "Error",
        description: "El formato del email no es válido",
        variant: "destructive"
      });
      return;
    }

    // Configurar especialidad basada en el rol
    const specialty = staffForm.role === 'veterinarian' ? staffForm.specialty : 'N/A';

    // Crear nuevo miembro
    const newStaff = {
      id: staffMembers.length + 1,
      name: staffForm.name,
      role: staffForm.role,
      email: staffForm.email,
      phone: staffForm.phone,
      specialty: specialty,
      status: staffForm.status
    };

    // Actualizar lista de personal
    setStaffMembers([...staffMembers, newStaff]);
    setIsNewStaffDialogOpen(false);
    
    // Resetear formulario
    setStaffForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      specialty: '',
      status: 'active'
    });
    
    toast({
      title: "Empleado agregado",
      description: `${newStaff.name} ha sido añadido al personal.`
    });
  };

  // Manejar edición de miembro del personal
  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      specialty: staff.specialty !== 'N/A' ? staff.specialty : '',
      status: staff.status
    });
    setIsEditDialogOpen(true);
  };

  // Guardar cambios de miembro editado
  const handleSaveEditedStaff = () => {
    // Validar campos obligatorios
    if (!staffForm.name || !staffForm.role || !staffForm.email || !staffForm.phone) {
      toast({
        title: "Error",
        description: "Nombre, rol, email y teléfono son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Validar email básico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(staffForm.email)) {
      toast({
        title: "Error",
        description: "El formato del email no es válido",
        variant: "destructive"
      });
      return;
    }

    // Configurar especialidad basada en el rol
    const specialty = staffForm.role === 'veterinarian' ? staffForm.specialty : 'N/A';

    // Actualizar miembro del personal
    const updatedStaffMembers = staffMembers.map(s => {
      if (s.id === selectedStaff.id) {
        return {
          ...s,
          name: staffForm.name,
          role: staffForm.role,
          email: staffForm.email,
          phone: staffForm.phone,
          specialty: specialty,
          status: staffForm.status
        };
      }
      return s;
    });

    setStaffMembers(updatedStaffMembers);
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
    
    toast({
      title: "Empleado actualizado",
      description: `${staffForm.name} ha sido actualizado correctamente.`
    });
  };

  // Manejar ver horario
  const handleViewSchedule = (staff) => {
    setSelectedStaff(staff);
    
    // Inicializar horario predeterminado para esta demostración
    const defaultSchedule = weekdays.reduce((acc, day, index) => {
      // Para esta demo, asumimos que todos trabajan de lunes a viernes
      const isActive = index < 5; // Activo de lunes a viernes
      acc[day.toLowerCase()] = { 
        active: isActive, 
        start: '08:00', 
        end: '18:00' 
      };
      return acc;
    }, {});
    
    setScheduleForm(defaultSchedule);
    setIsScheduleDialogOpen(true);
  };

  // Manejar cambios en el horario
  const handleScheduleChange = (day, field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Guardar horario
  const handleSaveSchedule = () => {
    setIsScheduleDialogOpen(false);
    
    toast({
      title: "Horario actualizado",
      description: `El horario de ${selectedStaff.name} ha sido actualizado correctamente.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsNewStaffDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, rol o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredStaff.map(staff => (
            <Card key={staff.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getRoleName(staff.role)}</p>
                    </div>
                  </div>
                  <ExtendedBadge variant={staff.status === 'active' ? 'success' : 'outline'}>
                    {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                  </ExtendedBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.phone}</span>
                  </div>
                  {staff.specialty !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Especialidad:</span>
                      <span>{staff.specialty}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditClick(staff)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewSchedule(staff)}
                    >
                      Ver horario
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
                  <TableHead>Rol</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {staff.name}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleName(staff.role)}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.specialty}</TableCell>
                    <TableCell>
                      <ExtendedBadge variant={staff.status === 'active' ? 'success' : 'outline'}>
                        {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                      </ExtendedBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(staff)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSchedule(staff)}
                        >
                          Ver horario
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

      {/* Dialog para nuevo empleado */}
      <Dialog open={isNewStaffDialogOpen} onOpenChange={setIsNewStaffDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Complete la información para agregar un nuevo miembro al personal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Nombre y apellidos"
                value={staffForm.name}
                onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                onValueChange={(value) => setStaffForm({...staffForm, role: value})}
                defaultValue={staffForm.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veterinarian">Veterinario</SelectItem>
                  <SelectItem value="receptionist">Recepcionista</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {staffForm.role === 'veterinarian' && (
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Input
                  id="specialty"
                  placeholder="Ej: Cirugía, Dermatología, etc."
                  value={staffForm.specialty}
                  onChange={(e) => setStaffForm({...staffForm, specialty: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@vetcare.com"
                value={staffForm.email}
                onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="555-1234"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Estado activo</Label>
              <Switch
                id="status"
                checked={staffForm.status === 'active'}
                onCheckedChange={(checked) => 
                  setStaffForm({...staffForm, status: checked ? 'active' : 'inactive'})
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewStaffDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewStaff}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar empleado */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique la información del empleado
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre y apellidos"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  onValueChange={(value) => setStaffForm({...staffForm, role: value})}
                  defaultValue={staffForm.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veterinarian">Veterinario</SelectItem>
                    <SelectItem value="receptionist">Recepcionista</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {staffForm.role === 'veterinarian' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">Especialidad</Label>
                  <Input
                    id="edit-specialty"
                    placeholder="Ej: Cirugía, Dermatología, etc."
                    value={staffForm.specialty}
                    onChange={(e) => setStaffForm({...staffForm, specialty: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@vetcare.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  placeholder="555-1234"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-status">Estado activo</Label>
                <Switch
                  id="edit-status"
                  checked={staffForm.status === 'active'}
                  onCheckedChange={(checked) => 
                    setStaffForm({...staffForm, status: checked ? 'active' : 'inactive'})
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEditedStaff}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver/editar horario */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Horario Semanal</DialogTitle>
            <DialogDescription>
              {selectedStaff && `Gestione el horario de trabajo para ${selectedStaff.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4 py-2">
              {weekdays.map(day => (
                <div key={day} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Switch
                      id={`day-${day}`}
                      checked={scheduleForm[day.toLowerCase()].active}
                      onCheckedChange={(checked) => 
                        handleScheduleChange(day.toLowerCase(), 'active', checked)
                      }
                    />
                    <Label htmlFor={`day-${day}`}>{day}</Label>
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${!scheduleForm[day.toLowerCase()].active && 'opacity-50'}`}>
                    <div>
                      <Label htmlFor={`start-${day}`} className="text-xs">Entrada</Label>
                      <Input
                        id={`start-${day}`}
                        type="time"
                        value={scheduleForm[day.toLowerCase()].start}
                        onChange={(e) => 
                          handleScheduleChange(day.toLowerCase(), 'start', e.target.value)
                        }
                        disabled={!scheduleForm[day.toLowerCase()].active}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`end-${day}`} className="text-xs">Salida</Label>
                      <Input
                        id={`end-${day}`}
                        type="time"
                        value={scheduleForm[day.toLowerCase()].end}
                        onChange={(e) => 
                          handleScheduleChange(day.toLowerCase(), 'end', e.target.value)
                        }
                        disabled={!scheduleForm[day.toLowerCase()].active}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSchedule} className="gap-2">
              <Calendar className="h-4 w-4" /> Guardar Horario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
