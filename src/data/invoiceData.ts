
import { Invoice, Payment, InvoiceItem } from '@/types';
import { users, pets, products, services } from './mockData';

// Generate invoice items
const generateInvoiceItems = (invoiceId: string, numItems: number): InvoiceItem[] => {
  const items: InvoiceItem[] = [];
  
  for (let i = 0; i < numItems; i++) {
    const isProduct = Math.random() > 0.5;
    const itemType = isProduct ? 'product' : 'service';
    
    const sourceItems = isProduct ? products : services;
    const randomItem = sourceItems[Math.floor(Math.random() * sourceItems.length)];
    
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = randomItem.price;
    
    items.push({
      id: `item-${invoiceId}-${i}`,
      invoiceId,
      type: itemType,
      itemId: randomItem.id,
      description: randomItem.name,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    });
  }
  
  return items;
};

// Generate invoices
export const invoices: Invoice[] = [];

const clients = users.filter(user => user.role === 'client');

// Generate 25 invoices
for (let i = 0; i < 25; i++) {
  const client = clients[Math.floor(Math.random() * clients.length)];
  const clientPets = pets.filter(pet => pet.ownerId === client.id);
  const pet = clientPets.length > 0 ? clientPets[Math.floor(Math.random() * clientPets.length)] : undefined;
  
  const today = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 60) - 30; // Between 30 days in the past and 30 in the future
  const invoiceDate = new Date(today);
  invoiceDate.setDate(today.getDate() + randomDaysAgo);
  
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(invoiceDate.getDate() + 15); // Due in 15 days
  
  const invoiceId = `inv-${i + 1000}`;
  const items = generateInvoiceItems(invoiceId, Math.floor(Math.random() * 4) + 1);
  
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + tax;
  
  const status = invoiceDate > today 
    ? 'pending' 
    : (Math.random() > 0.3 
        ? 'paid' 
        : (dueDate < today ? 'overdue' : 'pending'));
  
  invoices.push({
    id: invoiceId,
    clientId: client.id,
    petId: pet?.id,
    date: invoiceDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    status,
    subtotal,
    tax,
    total,
    items,
    paymentId: status === 'paid' ? `pay-${invoiceId}` : undefined,
  });
}

// Generate payments for paid invoices
export const payments: Payment[] = invoices
  .filter(invoice => invoice.status === 'paid')
  .map(invoice => {
    const paymentMethods = ['cash', 'credit_card', 'debit_card', 'transfer'] as const;
    const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    const paymentDate = new Date(invoice.date);
    paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 5)); // Paid within 5 days
    
    return {
      id: `pay-${invoice.id}`,
      invoiceId: invoice.id,
      date: paymentDate.toISOString().split('T')[0],
      amount: invoice.total,
      method: randomMethod,
      status: 'completed',
      reference: randomMethod !== 'cash' ? `REF-${Math.floor(Math.random() * 1000000)}` : undefined,
    };
  });
