
export type UserRole = 'admin' | 'veterinarian' | 'receptionist' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  imageUrl?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  veterinarianId: string;
}

export interface Appointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  veterinarianId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'medication' | 'food' | 'accessory' | 'other';
  imageUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'consult' | 'surgery' | 'grooming' | 'vaccination' | 'other';
}
