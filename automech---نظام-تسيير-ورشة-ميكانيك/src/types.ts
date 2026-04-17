export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  wilaya?: string;
  commune?: string;
  createdAt: string;
}

export interface CarInspection {
  bodyCondition: 'excellent' | 'good' | 'fair' | 'poor';
  engineStatus: 'excellent' | 'good' | 'fair' | 'poor';
  interiorCondition: 'excellent' | 'good' | 'fair' | 'poor';
  mileage?: string;
  notes?: string;
  inspectionDate?: string;
}

export interface MaintenanceHistory {
  id: string;
  date: string;
  type: string;
  parts: string;
  cost: number;
  notes?: string;
}

export interface Car {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  vin?: string;
  photos?: string[];
  inspection?: CarInspection;
  maintenanceHistory?: MaintenanceHistory[];
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  minQuantity: number;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone: string;
  email?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'part' | 'labor';
  partId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  carId: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  notes?: string;
}

export interface WorkshopSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  taxRate: number;
  logoUrl?: string;
  invoicePrefix: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export type View = 'dashboard' | 'customers' | 'cars' | 'parts' | 'suppliers' | 'invoices' | 'settings';
