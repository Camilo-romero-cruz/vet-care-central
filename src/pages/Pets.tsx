import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pets as mockPets, users as mockUsers, medicalRecords as mockRecords } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Pet, MedicalRecord } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar, FileText, Plus, User as UserIcon } from 'lucide-react';
import { PawIcon } from '@/components/icons/PawIcon';

const Pets = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);

  // Get clients for pet registration
  const clients = mockUsers.filter(user => user.role === 'client');

  // Filter pets based on user role
  const filteredPets = currentUser?.role === 'client'
    ? pets.filter(pet => pet.ownerId === currentUser.id)
    : pets;

  // Get owner name by ID
  const getOwnerName = (ownerId: string): string => {
    const owner = mockUsers.find(user => user.id === ownerId);
    return owner ? owner.name : 'Propietario no encontrado';
  };

  // Get medical records for the selected pet
  const getPetMedicalRecords = (petId: string): MedicalRecord[] => {
    return mockRecords.filter(record => record.petId === petId);
  };

  // Handle new pet creation
  const handleCreatePet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPet: Pet = {
      id: `${pets.length + 1}`,
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      age: parseInt(formData.get('age') as string),
      weight: parseFloat(formData.get('weight') as string),
      ownerId: currentUser?.role === 'client' ? currentUser.id : (formData.get('owner') as string),
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop'
    };
    
    setPets([...pets, newPet]);
    setIsDialogOpen(false);
    
    toast({
      title: 'Mascota registrada',
      description: `${newPet.name} ha sido registrado exitosamente.`,
    });
  };

  // Handle viewing pet details
  const handleViewPet = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mascotas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Mascota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreatePet}>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Mascota</DialogTitle>
                <DialogDescription>
                  Complete el formulario para registrar una nueva mascota.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nombre de la mascota"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="species">Especie</Label>
                    <Select name="species" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Perro">Perro</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Ave">Ave</SelectItem>
                        <SelectItem value="Conejo">Conejo</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="breed">Raza</Label>
                    <Input
                      id="breed"
                      name="breed"
                      placeholder="Raza"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Edad (años)</Label>
                    <Input
                      type="number"
                      id="age"
                      name="age"
                      min="0"
                      step="1"
                      placeholder="Edad"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      type="number"
                      id="weight"
                      name="weight"
                      min="0"
                      step="0.1"
                      placeholder="Peso"
                      required
                    />
                  </div>
                </div>
                {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
                  <div className="grid gap-2">
                    <Label htmlFor="owner">Propietario</Label>
                    <Select name="owner" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un propietario" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Registrar Mascota</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedPet ? (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPet(null)}
            >
              Volver a la lista
            </Button>
            <h2 className="text-2xl font-semibold">{selectedPet.name}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Mascota</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Especie:</dt>
                        <dd>{selectedPet.species}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Raza:</dt>
                        <dd>{selectedPet.breed}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Edad:</dt>
                        <dd>{selectedPet.age} años</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Peso:</dt>
                        <dd>{selectedPet.weight} kg</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Propietario:</dt>
                        <dd>{getOwnerName(selectedPet.ownerId)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="ml-4">
                    <img 
                      src={selectedPet.imageUrl || '/placeholder.svg'} 
                      alt={selectedPet.name} 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial Médico</CardTitle>
                  <CardDescription>Registros médicos de {selectedPet.name}</CardDescription>
                </div>
                {(currentUser?.role === 'admin' || currentUser?.role === 'veterinarian') && (
                  <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Nuevo registro
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Registro Médico</DialogTitle>
                        <DialogDescription>
                          Esta función estará disponible próximamente.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button onClick={() => setIsRecordDialogOpen(false)}>Cerrar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {getPetMedicalRecords(selectedPet.id).length > 0 ? (
                  <div className="space-y-4">
                    {getPetMedicalRecords(selectedPet.id).map((record) => (
                      <div key={record.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{record.diagnosis}</div>
                          <div className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div className="text-sm mb-2">
                          <span className="font-medium">Tratamiento:</span> {record.treatment}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Notas:</span> {record.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay registros médicos disponibles.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 relative">
                  <img 
                    src={pet.imageUrl || '/placeholder.svg'} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>
                    {pet.species} - {pet.breed}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Edad:</span>
                    <span>{pet.age} años</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Peso:</span>
                    <span>{pet.weight} kg</span>
                  </div>
                  {(currentUser?.role !== 'client') && (
                    <div className="flex items-center text-sm">
                      <UserIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Propietario:</span>
                      <span className="ml-auto">{getOwnerName(pet.ownerId)}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleViewPet(pet)}
                  >
                    <PawIcon className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-10 text-center">
              <PawIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">No hay mascotas registradas</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron mascotas. Puedes registrar una nueva mascota haciendo clic en el botón de abajo.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar Mascota
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pets;
