
import { User, Pet, MedicalRecord, Appointment, Product, Service } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Dr. María García',
    email: 'maria@vetcare.com',
    role: 'admin',
    imageUrl: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Dr. Carlos Rodríguez',
    email: 'carlos@vetcare.com',
    role: 'veterinarian',
    imageUrl: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Ana López',
    email: 'ana@vetcare.com',
    role: 'receptionist',
    imageUrl: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'client',
    imageUrl: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Laura Martínez',
    email: 'laura@email.com',
    role: 'client',
    imageUrl: 'https://i.pravatar.cc/150?img=5'
  }
];

// Mock Pets
export const pets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    weight: 25.5,
    ownerId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    age: 2,
    weight: 4.2,
    ownerId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Rocky',
    species: 'Perro',
    breed: 'Bulldog',
    age: 5,
    weight: 18.7,
    ownerId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700442b31b?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Mia',
    species: 'Gato',
    breed: 'Persa',
    age: 1,
    weight: 3.8,
    ownerId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=300&auto=format&fit=crop'
  }
];

// Mock Medical Records
export const medicalRecords: MedicalRecord[] = [
  {
    id: '1',
    petId: '1',
    date: '2025-03-15',
    diagnosis: 'Infección de oído',
    treatment: 'Antibióticos durante 10 días',
    notes: 'Revisar en 2 semanas',
    veterinarianId: '2'
  },
  {
    id: '2',
    petId: '2',
    date: '2025-03-20',
    diagnosis: 'Alergia estacional',
    treatment: 'Antihistamínicos según sea necesario',
    notes: 'Vigilar síntomas',
    veterinarianId: '2'
  }
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: '1',
    petId: '1',
    date: '2025-04-10',
    time: '10:00',
    reason: 'Revisión anual',
    status: 'scheduled',
    veterinarianId: '2'
  },
  {
    id: '2',
    petId: '3',
    date: '2025-04-10',
    time: '11:30',
    reason: 'Vacunación',
    status: 'scheduled',
    veterinarianId: '2'
  },
  {
    id: '3',
    petId: '2',
    date: '2025-04-11',
    time: '15:00',
    reason: 'Seguimiento de tratamiento',
    status: 'scheduled',
    veterinarianId: '2'
  },
  {
    id: '4',
    petId: '4',
    date: '2025-04-03',
    time: '09:30',
    reason: 'Problema digestivo',
    status: 'scheduled',
    veterinarianId: '2'
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Pedigree Adulto',
    description: 'Alimento seco para perros adultos de todas las razas',
    price: 25.99,
    stock: 45,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Amoxicilina',
    description: 'Antibiótico para infecciones bacterianas',
    price: 15.50,
    stock: 30,
    category: 'medication',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Collar antipulgas',
    description: 'Protección contra pulgas y garrapatas por 8 meses',
    price: 18.75,
    stock: 25,
    category: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1576466833110-32d2da037d05?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Juguete dental',
    description: 'Juguete para la higiene dental de perros',
    price: 12.99,
    stock: 40,
    category: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1590507011613-0374c8f0898a?q=80&w=200&auto=format&fit=crop'
  }
];

// Mock Services
export const services: Service[] = [
  {
    id: '1',
    name: 'Consulta general',
    description: 'Evaluación general de salud',
    price: 35.00,
    duration: 30,
    category: 'consult'
  },
  {
    id: '2',
    name: 'Vacunación completa',
    description: 'Set completo de vacunas según especie y edad',
    price: 45.00,
    duration: 20,
    category: 'vaccination'
  },
  {
    id: '3',
    name: 'Baño y corte de pelo',
    description: 'Servicio completo de higiene y estética',
    price: 28.50,
    duration: 60,
    category: 'grooming'
  },
  {
    id: '4',
    name: 'Cirugía de esterilización',
    description: 'Procedimiento quirúrgico de esterilización',
    price: 120.00,
    duration: 90,
    category: 'surgery'
  }
];
