/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CarFront, 
  Package, 
  FileText, 
  Truck, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Download,
  AlertTriangle,
  ChevronRight,
  Settings,
  X,
  Printer,
  Calendar,
  Image as ImageIcon,
  ClipboardCheck,
  Info,
  Camera,
  ShieldCheck,
  MessageCircle,
  History,
  List,
  Columns
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatDate } from './lib/utils';
import { 
  Customer, 
  Car, 
  Part, 
  Supplier, 
  Invoice, 
  View,
  InvoiceItem,
  WorkshopSettings,
  MaintenanceHistory
} from './types';

// Mock/Initial Data
const INITIAL_CUSTOMERS: Customer[] = [];
const INITIAL_CARS: Car[] = [];
const INITIAL_PARTS: Part[] = [];
const INITIAL_SUPPLIERS: Supplier[] = [];
const INITIAL_INVOICES: Invoice[] = [];

const CAR_DATA: Record<string, string[]> = {
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'EQS', 'AMG GT', 'Vito', 'Sprinter'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'M3', 'M5', 'i4', 'iX', 'i7'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Evoque', 'Defender', 'Discovery', 'Discovery Sport'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Arteon', 'ID.3', 'ID.4', 'ID.6', 'T-Roc', 'Teramont', 'Caddy'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'TT', 'R8', 'RS6', 'RS7'],
  'Seat': ['Ibiza', 'Leon', 'Ateca', 'Tarraco', 'Arona'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq', 'Enyaq', 'Scala'],
  'Peugeot': ['208', '308', '408', '508', '2008', '3008', '5008', 'Partner', 'Rifter', 'Expert'],
  'Renault': ['Clio', 'Captur', 'Megane', 'Arkana', 'Kadjar', 'Austral', 'Koleos', 'Zoe', 'Symbol', 'Logan', 'Duster'],
  'Toyota': ['Yaris', 'Corolla', 'Camry', 'Avalon', 'C-HR', 'Rav4', 'Highlander', 'Land Cruiser', 'Land Cruiser Prado', 'Hilux', 'Supra', 'Rush', 'Fortuner'],
  'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Sonata', 'Azera', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'Ioniq 5', 'Veloster'],
  'Kia': ['Picanto', 'Rio', 'Cerato', 'Optima', 'K5', 'K8', 'Stinger', 'Sportage', 'Sorento', 'Telluride', 'EV6', 'Carnival'],
  'Ford': ['Fiesta', 'Focus', 'Mustang', 'Edge', 'Explorer', 'Expedition', 'F-150', 'Ranger', 'Taurus', 'Territory'],
  'Nissan': ['Sunny', 'Sentra', 'Altima', 'Maxima', 'Kicks', 'Qashqai', 'X-Trail', 'Patrol', 'Navara', 'Z', 'Pathfinder'],
  'Chevrolet': ['Spark', 'Malibu', 'Camaro', 'Trax', 'Equinox', 'Blazer', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Captiva'],
  'Honda': ['City', 'Civic', 'Accord', 'HR-V', 'CR-V', 'Pilot', 'Odyssey'],
  'Mitsubishi': ['Attrage', 'Lancer', 'ASX', 'Eclipse Cross', 'Outlander', 'Pajero', 'L200', 'Montero Sport', 'Xpander'],
  'Mazda': ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'CX-90'],
  'Lexus': ['IS', 'ES', 'LS', 'UX', 'NX', 'RX', 'GX', 'LX', 'LC'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718'],
  'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
  'GMC': ['Sierra', 'Yukon', 'Acadia', 'Terrain'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Ram'],
};

const ALGERIA_WILAYAS = [
  "01-أدرار", "02-الشلف", "03-الأغواط", "04-أم البواقي", "05-باتنة", "06-بجاية", "07-بسكرة", "08-بشار", "09-البليدة", "10-البويرة",
  "11-تمنراست", "12-تبسة", "13-تلمسان", "14-تيارت", "15-تيزي وزو", "16-الجزائر", "17-الجلفة", "18-جيجل", "19-سطيف", "20-سعيدة",
  "21-سكيكدة", "22-سيدي بلعباس", "23-عنابة", "24-قالمة", "25-قسنطينة", "26-المدية", "27-مستغانم", "28-المسيلة", "29-معسكر", "30-ورقلة",
  "31-وهران", "32-البيض", "33-إليزي", "34-برج بوعريريج", "35-بومرداس", "36-الطارف", "37-تندوف", "38-تيسمسيلت", "39-الوادي", "40-خنشلة",
  "41-سوق أهراس", "42-تيبازة", "43-ميلة", "44-عين الدفلى", "45-النعامة", "46-عين تموشنت", "47-غرداية", "48-غليزان", "49-المغير", "50-المنيعة",
  "51-أولاد جلال", "52-برج باجي مختار", "53-بني عباس", "54-تيميمون", "55-تقرت", "56-جانت", "57-إن صالح", "58-إن قزام"
];

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeCarModalTab, setActiveCarModalTab] = useState<'details' | 'inspection' | 'history'>('details');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historySortKey, setHistorySortKey] = useState<'date' | 'cost'>('date');
  const [historySortOrder, setHistorySortOrder] = useState<'asc' | 'desc'>('desc');
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('automech_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem('automech_cars');
    return saved ? JSON.parse(saved) : INITIAL_CARS;
  });
  const [parts, setParts] = useState<Part[]>(() => {
    const saved = localStorage.getItem('automech_parts');
    return saved ? JSON.parse(saved) : INITIAL_PARTS;
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('automech_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('automech_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [settings, setSettings] = useState<WorkshopSettings>(() => {
    const saved = localStorage.getItem('automech_settings');
    return saved ? JSON.parse(saved) : {
      name: 'ورشتي الذكية',
      phone: '05XXXXXXXX',
      email: 'contact@workshop.com',
      address: 'العنوان البريدي للورشة',
      currency: 'SAR',
      taxRate: 15,
      invoicePrefix: 'INV-'
    };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('');
  const [filterModel, setFilterModel] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [customerVisibleColumns, setCustomerVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem('automech_customer_columns');
    return saved ? JSON.parse(saved) : ['name', 'contact', 'date', 'location', 'cars', 'actions'];
  });
  const [invoiceVisibleColumns, setInvoiceVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem('automech_invoice_columns');
    return saved ? JSON.parse(saved) : ['number', 'customer', 'car', 'date', 'total', 'status', 'actions'];
  });
  const [showColumnPicker, setShowColumnPicker] = useState<'customers' | 'invoices' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formSelectedBrand, setFormSelectedBrand] = useState<string>('');
  const [formSelectedModel, setFormSelectedModel] = useState<string>('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('automech_customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('automech_cars', JSON.stringify(cars));
  }, [cars]);
  useEffect(() => {
    localStorage.setItem('automech_parts', JSON.stringify(parts));
  }, [parts]);
  useEffect(() => {
    localStorage.setItem('automech_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    localStorage.setItem('automech_customer_columns', JSON.stringify(customerVisibleColumns));
  }, [customerVisibleColumns]);
  useEffect(() => {
    localStorage.setItem('automech_invoice_columns', JSON.stringify(invoiceVisibleColumns));
  }, [invoiceVisibleColumns]);
  useEffect(() => {
    localStorage.setItem('automech_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('automech_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (editingItem && activeView === 'cars') {
      const brand = editingItem.make || '';
      const model = editingItem.model || '';
      setFormSelectedBrand(brand);
      if (CAR_DATA[brand] && !CAR_DATA[brand].includes(model)) {
        setFormSelectedModel('Other');
      } else {
        setFormSelectedModel(model);
      }
    } else if (!isModalOpen) {
      setFormSelectedBrand('');
      setFormSelectedModel('');
    }
  }, [editingItem, activeView, isModalOpen]);

  const stats = {
    totalCustomers: customers.length,
    activeTasks: invoices.filter(i => i.status === 'pending').length,
    lowStock: parts.filter(p => p.quantity <= p.minQuantity).length,
    totalRevenue: invoices.reduce((acc, i) => acc + (i.status === 'paid' ? i.totalAmount : 0), 0)
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'customers', label: 'العملاء', icon: Users },
    { id: 'cars', label: 'السيارات', icon: CarFront },
    { id: 'parts', label: 'المخزون', icon: Package },
    { id: 'suppliers', label: 'الموردين', icon: Truck },
    { id: 'invoices', label: 'الفواتير', icon: FileText },
    { id: 'settings', label: 'إعدادات البرنامج', icon: Settings },
  ];

  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [printInspection, setPrintInspection] = useState<Car | null>(null);
  const [carPhotos, setCarPhotos] = useState<string[]>([]);
  const [currentCarHistory, setCurrentCarHistory] = useState<MaintenanceHistory[]>([]);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState<Omit<MaintenanceHistory, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    parts: '',
    cost: 0,
    notes: ''
  });

  const handlePrint = (invoice: Invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => {
      window.print();
      setPrintInvoice(null);
    }, 100);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setInvoiceItems([]);
    setSelectedCustomerId('');
    setSelectedCarId('');
    setCarPhotos([]);
    setFormSelectedBrand('');
    setFormSelectedModel('');
    setActiveCarModalTab('details');
    setCurrentCarHistory([]);
    setShowAddMaintenance(false);
    setIsModalOpen(true);
  };

  const renderInvoices = () => {
    const columns = [
      { id: 'number', label: 'رقم الفاتورة' },
      { id: 'customer', label: 'العميل' },
      { id: 'car', label: 'السيارة' },
      { id: 'date', label: 'التاريخ' },
      { id: 'total', label: 'المبلغ الإجمالي' },
      { id: 'status', label: 'الحالة' },
      { id: 'actions', label: 'الإجراءات' }
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-text-main">إدارة الفواتير والمالية</h2>
          <button 
            onClick={handleAdd}
            className="bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-brand-accent/20 font-bold"
          >
            <Plus size={20} /> إنشاء فاتورة جديدة
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowColumnPicker(showColumnPicker === 'invoices' ? null : 'invoices')}
              className="px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text-muted hover:text-brand-accent transition-colors"
              title="تخصيص الأعمدة"
            >
              <Columns size={20} />
            </button>
            {showColumnPicker === 'invoices' && renderColumnPicker('invoices', columns, invoiceVisibleColumns, setInvoiceVisibleColumns)}
          </div>
        </div>

        <div className="bento-card overflow-hidden !p-0">
          <table className="w-full text-right divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {invoiceVisibleColumns.includes('number') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">رقم الفاتورة</th>}
                {invoiceVisibleColumns.includes('customer') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">العميل</th>}
                {invoiceVisibleColumns.includes('car') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">السيارة</th>}
                {invoiceVisibleColumns.includes('date') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">التاريخ</th>}
                {invoiceVisibleColumns.includes('total') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">المبلغ الإجمالي</th>}
                {invoiceVisibleColumns.includes('status') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">الحالة</th>}
                {invoiceVisibleColumns.includes('actions') && <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase text-center">الإجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.filter(inv => {
                const customerName = customers.find(c => c.id === inv.customerId)?.name || '';
                return inv.invoiceNumber.includes(searchTerm) || customerName.includes(searchTerm);
              }).map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                  {invoiceVisibleColumns.includes('number') && <td className="px-6 py-4 font-black text-brand-text-main">{invoice.invoiceNumber}</td>}
                  {invoiceVisibleColumns.includes('customer') && (
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {customers.find(c => c.id === invoice.customerId)?.name || 'عميل محذوف'}
                    </td>
                  )}
                  {invoiceVisibleColumns.includes('car') && (
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {(() => {
                        const car = cars.find(c => c.id === invoice.carId);
                        return car ? `${car.make} ${car.model} (${car.plateNumber})` : '-';
                      })()}
                    </td>
                  )}
                  {invoiceVisibleColumns.includes('date') && <td className="px-6 py-4 text-xs text-brand-text-muted">{formatDate(invoice.date)}</td>}
                  {invoiceVisibleColumns.includes('total') && <td className="px-6 py-4 font-black text-brand-text-main">{formatCurrency(invoice.totalAmount)}</td>}
                  {invoiceVisibleColumns.includes('status') && (
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black border",
                        invoice.status === 'paid' ? "bg-green-50 text-green-700 border-green-100" : "bg-orange-50 text-orange-700 border-orange-100"
                      )}>
                        {invoice.status === 'paid' ? 'مدفوعة' : 'معلقة'}
                      </span>
                    </td>
                  )}
                  {invoiceVisibleColumns.includes('actions') && (
                    <td className="px-6 py-4">
                      <div className="flex gap-1 justify-center">
                        <button 
                          onClick={() => handleEdit(invoice)}
                          className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handlePrint(invoice)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete('invoice', invoice.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-brand-text-muted italic font-bold">
                    لا توجد فواتير مسجلة بعد. ابدأ بإنشاء أول فاتورة!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  
  // Update invoice items when editing
  useEffect(() => {
    if (activeView === 'invoices' && editingItem) {
      setInvoiceItems(editingItem.items || []);
      setSelectedCustomerId(editingItem.customerId || '');
      setSelectedCarId(editingItem.carId || '');
    } else {
      setInvoiceItems([]);
      setSelectedCustomerId('');
      setSelectedCarId('');
    }
  }, [editingItem, activeView]);

  const renderInvoiceForm = () => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;

    // Filter cars for the selected customer
    const filteredCars = cars.filter(car => car.customerId === selectedCustomerId);

    return (
      <div className="space-y-6 h-full flex flex-col no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-brand-text-muted uppercase">العميل</label>
            <select 
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setSelectedCarId(''); // Reset car when customer changes
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20 font-bold"
              required
            >
              <option value="">اختر عميل...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-brand-text-muted uppercase">السيارة</label>
            <select 
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20 font-bold"
              disabled={!selectedCustomerId}
            >
              <option value="">اختر سيارة (اختياري)...</option>
              {filteredCars.map(c => <option key={c.id} value={c.id}>{c.make} {c.model} ({c.plateNumber})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-brand-text-muted uppercase">رقم الفاتورة</label>
            <input 
              readOnly 
              value={editingItem?.invoiceNumber || `${settings.invoicePrefix}${invoices.length + 1001}`} 
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-brand-border outline-none text-brand-text-muted font-mono"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-brand-border">
            <h4 className="font-black text-sm">بنود الفاتورة</h4>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  const newItem: InvoiceItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    description: '',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                    type: 'part'
                  };
                  setInvoiceItems([...invoiceItems, newItem]);
                }}
                className="bg-brand-accent text-white font-bold text-[10px] flex items-center gap-1 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                <Package size={12} /> إضافة قطعة غيار
              </button>
              <button 
                type="button"
                onClick={() => {
                  const newItem: InvoiceItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    description: '',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                    type: 'labor'
                  };
                  setInvoiceItems([...invoiceItems, newItem]);
                }}
                className="bg-slate-800 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                <Users size={12} /> إضافة بند عمل
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {invoiceItems.map((item, index) => {
              const selectedPart = item.type === 'part' ? parts.find(p => p.id === item.partId) : null;
              const hasInsufficientStock = item.type === 'part' && selectedPart && item.quantity > selectedPart.quantity;

              return (
                <div key={item.id} className={cn(
                  "grid grid-cols-12 gap-3 items-end bg-white p-4 rounded-xl border shadow-sm animate-in zoom-in-95 duration-200 transition-colors",
                  hasInsufficientStock ? "border-red-200 bg-red-50/10" : "border-slate-100"
                )}>
                  <div className="col-span-12 md:col-span-5 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-brand-text-muted uppercase flex items-center gap-1">
                        {item.type === 'part' ? <Package size={10} /> : <Users size={10} />}
                        {item.type === 'part' ? 'قطعة غيار' : 'الوصف / العمل'}
                      </label>
                      {hasInsufficientStock && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={10} /> تنبيه: الكمية غير متوفرة (المتاح: {selectedPart.quantity})
                        </span>
                      )}
                    </div>
                    
                    {item.type === 'part' ? (
                      <select
                        value={item.partId || ''}
                        onChange={(e) => {
                          const p = parts.find(x => x.id === e.target.value);
                          const newItems = [...invoiceItems];
                          newItems[index] = {
                            ...newItems[index],
                            partId: e.target.value,
                            description: p?.name || '',
                            unitPrice: p?.price || 0,
                            total: (p?.price || 0) * (newItems[index].quantity)
                          };
                          setInvoiceItems(newItems);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none text-sm font-bold"
                      >
                        <option value="">اختر قطعة...</option>
                        {parts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (المخزون: {p.quantity}) - {formatCurrency(p.price)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[index].description = e.target.value;
                          setInvoiceItems(newItems);
                        }}
                        placeholder="مثال: تغيير فلتر الزيت"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none text-sm"
                      />
                    )}
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase">الكمية</label>
                    <input 
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const newItems = [...invoiceItems];
                        const val = Math.max(1, Number(e.target.value));
                        newItems[index].quantity = val;
                        newItems[index].total = val * newItems[index].unitPrice;
                        setInvoiceItems(newItems);
                      }}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg bg-slate-50 border outline-none text-sm font-bold",
                        hasInsufficientStock ? "border-red-300 text-red-600 focus:ring-red-500/20" : "border-slate-200"
                      )}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-3 space-y-1">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase">سعر الوحدة</label>
                    <input 
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...invoiceItems];
                        const val = Number(e.target.value);
                        newItems[index].unitPrice = val;
                        newItems[index].total = val * newItems[index].quantity;
                        setInvoiceItems(newItems);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 flex justify-end gap-1">
                     <button 
                      type="button"
                      onClick={() => setInvoiceItems(invoiceItems.filter(i => i.id !== item.id))}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                     >
                      <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-4 items-center">
              <label className="text-xs font-black text-brand-text-muted uppercase">حالة الدفع</label>
              <div className="bg-slate-100 p-1 rounded-xl flex">
                 <button 
                  type="button" 
                  onClick={() => setEditingItem(editingItem ? {...editingItem, status: 'pending'} : null)}
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", (!editingItem || editingItem.status === 'pending') ? "bg-white text-orange-600 shadow-sm" : "text-slate-500")}
                 >معلقة</button>
                 <button 
                  type="button" 
                  onClick={() => setEditingItem(editingItem ? {...editingItem, status: 'paid'} : null)}
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", (editingItem?.status === 'paid') ? "bg-white text-green-600 shadow-sm" : "text-slate-500")}
                 >مدفوعة</button>
              </div>
           </div>
           
           <div className="text-left w-full md:w-auto">
              <div className="flex justify-between md:gap-12 mb-1">
                 <span className="text-xs text-brand-text-muted font-bold">المجموع الفرعي:</span>
                 <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between md:gap-12 mb-2">
                 <span className="text-xs text-brand-text-muted font-bold">الضريبة ({settings.taxRate}%):</span>
                 <span className="font-bold">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between md:gap-12 pt-2 border-t border-slate-200">
                 <span className="text-sm font-black text-brand-text-main">الإجمالي الكلي:</span>
                 <span className="text-xl font-black text-brand-accent">{formatCurrency(total)}</span>
              </div>
           </div>
        </div>

        <div className="pt-4 flex gap-3 text-sm">
           <button 
            type="button"
            onClick={() => {
              if (!selectedCustomerId) return alert('الرجاء اختيار العميل');
              if (invoiceItems.length === 0) return alert('الرجاء إضافة بند واحد على الأقل');
              
              // Check insufficient stock and confirm
              const insufficientItems = invoiceItems.filter(item => {
                if (item.type !== 'part' || !item.partId) return false;
                const p = parts.find(x => x.id === item.partId);
                return p && item.quantity > p.quantity;
              });

              if (insufficientItems.length > 0) {
                const names = insufficientItems.map(i => i.description).join('، ');
                if (!confirm(`تنبيه: الكميات المطلوبة لـ (${names}) تتجاوز المخزون المتوفر. هل تريد متابعة الخصم من المخزون مما قد يؤدي لظهور كميات سالبة أو إعادة الطلب لاحقاً؟`)) {
                  return;
                }
              }

              // Update inventory
              const updatePartsInventory = (oldItems: InvoiceItem[], newItems: InvoiceItem[]) => {
                let refreshedParts = parts.map(p => ({ ...p }));
                
                // Revert old items (add back to stock)
                oldItems.forEach(item => {
                  if (item.type === 'part' && item.partId) {
                    const idx = refreshedParts.findIndex(p => p.id === item.partId);
                    if (idx !== -1) {
                      refreshedParts[idx].quantity += item.quantity;
                    }
                  }
                });

                // Deduct new items
                newItems.forEach(item => {
                  if (item.type === 'part' && item.partId) {
                    const idx = refreshedParts.findIndex(p => p.id === item.partId);
                    if (idx !== -1) {
                      refreshedParts[idx].quantity -= item.quantity;
                    }
                  }
                });
                
                setParts(refreshedParts);
              };

              if (editingItem && editingItem.invoiceNumber) {
                 const oldInvoice = invoices.find(inv => inv.id === editingItem.id);
                 updatePartsInventory(oldInvoice?.items || [], invoiceItems);

                 setInvoices(prev => prev.map(inv => inv.id === editingItem.id ? {
                    ...inv,
                    customerId: selectedCustomerId,
                    carId: selectedCarId,
                    items: invoiceItems,
                    totalAmount: total,
                    status: (editingItem as Invoice).status
                 } : inv));
              } else {
                 updatePartsInventory([], invoiceItems);
                 const newInvoice: Invoice = {
                    id: Math.random().toString(36).substr(2, 9),
                    invoiceNumber: `${settings.invoicePrefix}${invoices.length + 1001}`,
                    customerId: selectedCustomerId,
                    carId: selectedCarId,
                    date: new Date().toISOString(),
                    items: invoiceItems,
                    totalAmount: total,
                    status: 'pending'
                 };
                 setInvoices(prev => [...prev, newInvoice]);
              }
              setIsModalOpen(false);
            }}
            className="flex-1 bg-brand-accent text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-brand-accent/20 transition-all uppercase tracking-tight"
           >
            {editingItem?.invoiceNumber ? 'تحديث الفاتورة' : 'إصدار الفاتورة وحفظها'}
           </button>
           <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">إلغاء</button>
        </div>
      </div>
    );
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeView === 'cars') {
      setCarPhotos(item.photos || []);
      setFormSelectedBrand(item.make || '');
      setFormSelectedModel(item.model || '');
      setActiveCarModalTab('details');
      setCurrentCarHistory(item.maintenanceHistory || []);
      setShowAddMaintenance(false);
    } else if (activeView === 'invoices') {
      setInvoiceItems(item.items || []);
      setSelectedCustomerId(item.customerId || '');
      setSelectedCarId(item.carId || '');
    }
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً للمتصفح. يرجى اختيار صورة أقل من 1 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCars = () => {
    const availableYears = Array.from(new Set(cars.map(c => c.year))).sort((a: any, b: any) => String(b).localeCompare(String(a)));
    const yearRanges = [
      { label: '2020 - 2025', value: '2020-2025' },
      { label: '2016 - 2019', value: '2016-2019' },
      { label: '2010 - 2015', value: '2010-2015' },
      { label: '2000 - 2009', value: '2000-2009' },
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-text-main">إدارة سيارات العملاء</h2>
        <button 
          onClick={handleAdd}
          className="bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-brand-accent/20 font-bold"
        >
          <Plus size={20} /> إضافة سيارة جديدة
        </button>
      </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="بحث برقم اللوحة أو الموديل أو اسم العميل..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 md:min-w-[450px]">
            <select 
              className="flex-1 min-w-[120px] px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none text-sm font-bold"
              value={filterBrand}
              onChange={(e) => {
                setFilterBrand(e.target.value);
                setFilterModel(''); // Reset model when brand changes
              }}
            >
              <option value="">كل الماركات</option>
              {Object.keys(CAR_DATA).sort().map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select 
              className="flex-1 min-w-[120px] px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none text-sm font-bold"
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              disabled={!filterBrand}
            >
              <option value="">كل الموديلات</option>
              {filterBrand && CAR_DATA[filterBrand] && CAR_DATA[filterBrand].map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>

            <select 
              className="flex-1 min-w-[150px] px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none text-sm font-bold"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">كل السنوات</option>
              <optgroup label="فترات زمنية">
                {yearRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </optgroup>
              <optgroup label="سنوات محددة">
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.filter(car => {
            const customerName = customers.find(c => c.id === car.customerId)?.name || '';
            const matchesSearch = car.plateNumber.includes(searchTerm) || car.model.includes(searchTerm) || customerName.includes(searchTerm);
            const matchesBrand = !filterBrand || car.make === filterBrand;
            const matchesModel = !filterModel || car.model === filterModel;
            const matchesYear = !filterYear || (
              filterYear.includes('-') 
                ? (() => {
                    const [start, end] = filterYear.split('-').map(Number);
                    const carYear = Number(car.year);
                    return carYear >= start && carYear <= end;
                  })()
                : (car.year === filterYear)
            );
            
            return matchesSearch && matchesBrand && matchesModel && matchesYear;
          }).map(car => {
          const customer = customers.find(c => c.id === car.customerId);
          return (
            <div key={car.id} className="bento-card relative group overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent border border-slate-100">
                    <CarFront size={24} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(car)}
                      className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete('car', car.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-brand-text-main uppercase tracking-tight">{car.make} {car.model}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <p className="text-xs font-black text-brand-accent bg-brand-accent/5 inline-block px-2 py-0.5 rounded-md">
                        {car.plateNumber}
                      </p>
                      {car.vin && (
                        <p className="text-xs font-bold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-md font-mono">
                          VIN: {car.vin}
                        </p>
                      )}
                    </div>
                  </div>

                  {car.photos && car.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {car.photos.map((photo, i) => (
                        <img key={i} src={photo} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-100" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                  )}

                  {car.inspection && (
                    <div className="bg-slate-50 p-2.5 rounded-xl space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-brand-text-muted">
                        <span>حالة المركبة عند الاستلام</span>
                        <ClipboardCheck size={12} className="text-brand-accent" />
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="text-center p-1.5 rounded-lg bg-white border border-slate-100">
                          <p className="text-[8px] text-slate-400 font-bold mb-0.5">الهيكل</p>
                          <span className={cn(
                            "text-[8px] font-black px-1 py-0.5 rounded",
                            car.inspection.bodyCondition === 'excellent' ? 'bg-green-50 text-green-600' : 
                            car.inspection.bodyCondition === 'good' ? 'bg-blue-50 text-blue-600' :
                            'bg-orange-50 text-orange-600'
                          )}>
                            {car.inspection.bodyCondition === 'excellent' ? 'ممتاز' : 
                             car.inspection.bodyCondition === 'good' ? 'جيد' : 
                             car.inspection.bodyCondition === 'fair' ? 'متوسط' : 'سيء'}
                          </span>
                        </div>
                        <div className="text-center p-1.5 rounded-lg bg-white border border-slate-100">
                          <p className="text-[8px] text-slate-400 font-bold mb-0.5">المحرك</p>
                          <span className={cn(
                            "text-[8px] font-black px-1 py-0.5 rounded",
                            car.inspection.engineStatus === 'excellent' ? 'bg-green-50 text-green-600' : 
                            car.inspection.engineStatus === 'good' ? 'bg-blue-50 text-blue-600' :
                            'bg-orange-50 text-orange-600'
                          )}>
                            {car.inspection.engineStatus === 'excellent' ? 'ممتاز' : 
                             car.inspection.engineStatus === 'good' ? 'جيد' : 
                             car.inspection.engineStatus === 'fair' ? 'متوسط' : 'سيء'}
                          </span>
                        </div>
                        <div className="text-center p-1.5 rounded-lg bg-white border border-slate-100">
                          <p className="text-[8px] text-slate-400 font-bold mb-0.5">الداخل</p>
                          <span className={cn(
                            "text-[8px] font-black px-1 py-0.5 rounded",
                            car.inspection.interiorCondition === 'excellent' ? 'bg-green-50 text-green-600' : 
                            car.inspection.interiorCondition === 'good' ? 'bg-blue-50 text-blue-600' :
                            'bg-orange-50 text-orange-600'
                          )}>
                            {car.inspection.interiorCondition === 'excellent' ? 'ممتاز' : 
                             car.inspection.interiorCondition === 'good' ? 'جيد' : 
                             car.inspection.interiorCondition === 'fair' ? 'متوسط' : 'سيء'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                         <Users size={12} />
                         <span className="font-bold">{customer?.name || 'عميل غير معروف'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-brand-text-muted">
                         <Calendar size={12} />
                         <span className="font-bold">سنة: {car.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-brand-accent">
                         <History size={12} />
                         <button 
                           onClick={() => {
                             handleEdit(car);
                             setActiveCarModalTab('history');
                           }}
                           className="font-black hover:underline"
                         >
                           {(car.maintenanceHistory?.length || 0)} سجلات صيانة
                           {car.maintenanceHistory && car.maintenanceHistory.length > 0 && (
                             <span className="mr-1 text-slate-400 font-bold">
                               ({formatCurrency(car.maintenanceHistory.reduce((sum, h) => sum + (h.cost || 0), 0))})
                             </span>
                           )}
                         </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleEdit(car)}
                         className="p-2 text-brand-accent bg-brand-accent/5 rounded-lg hover:bg-brand-accent/10 transition-colors"
                         title="تفاصيل السيارة"
                       >
                         <Info size={16} />
                       </button>
                      {car.inspection && (
                        <button 
                          onClick={() => {
                            setPrintInspection(car);
                            setTimeout(() => {
                              window.print();
                              setPrintInspection(null);
                            }, 150);
                          }}
                          className="p-2 bg-slate-50 text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-all"
                          title="طباعة تقرير المعاينة"
                        >
                          <Printer size={16} />
                        </button>
                      )}
                    </div>
                  </div>
               </div>
               
               {/* Decorative background element */}
               <div className="absolute -bottom-4 -left-4 text-slate-50 rotate-12 -z-10 group-hover:text-brand-accent/5 transition-colors">
                  <CarFront size={120} />
               </div>
            </div>
          );
        })}
        {cars.length === 0 && (
          <div className="col-span-full py-20 text-center bento-card border-dashed">
            <CarFront size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-brand-text-muted italic font-bold">لا توجد سيارات مسجلة بعد. ابدأ بإضافة أول سيارة لعميلك!</p>
          </div>
        )}
      </div>
    </div>
  );
};

  const handleDelete = (type: 'customer' | 'part' | 'invoice' | 'car' | 'supplier', id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا البند؟')) {
      if (type === 'customer') {
        setCustomers(prev => prev.filter(c => c.id !== id));
      } else if (type === 'part') {
        setParts(prev => prev.filter(p => p.id !== id));
      } else if (type === 'invoice') {
        const invToDelete = invoices.find(i => i.id === id);
        if (invToDelete) {
          const refreshedParts = parts.map(p => ({ ...p }));
          invToDelete.items.forEach(item => {
            if (item.type === 'part' && item.partId) {
              const idx = refreshedParts.findIndex(p => p.id === item.partId);
              if (idx !== -1) {
                refreshedParts[idx].quantity += item.quantity;
              }
            }
          });
          setParts(refreshedParts);
        }
        setInvoices(prev => prev.filter(i => i.id !== id));
      } else if (type === 'car') {
        setCars(prev => prev.filter(c => c.id !== id));
      } else if (type === 'supplier') {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const renderSuppliers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-text-main">إدارة الموردين</h2>
        <button 
          onClick={handleAdd}
          className="bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-brand-accent/20 font-bold"
        >
          <Plus size={20} /> إضافة مورد جديد
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="بحث عن مورد بالاسم أو رقم الهاتف..."
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.filter(s => s.name.includes(searchTerm) || s.phone.includes(searchTerm)).map(supplier => (
          <div key={supplier.id} className="bento-card relative group flex flex-col justify-between overflow-hidden">
             <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent border border-slate-100">
                    <Truck size={24} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(supplier)}
                      className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete('supplier', supplier.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-brand-text-main">{supplier.name}</h3>
                  <p className="text-xs font-bold text-brand-text-muted mt-1">مسؤول التواصل: {supplier.contactName || 'غير محدد'}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Users size={14} />
                    </div>
                    <span className="font-bold">{supplier.phone}</span>
                  </div>
                  {supplier.email && (
                    <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <FileText size={14} />
                      </div>
                      <span className="font-medium truncate">{supplier.email}</span>
                    </div>
                  )}
                </div>
             </div>
             
             {/* Background decorative icon */}
             <Truck className="absolute -bottom-6 -left-6 text-slate-50 -z-10 group-hover:text-brand-accent/5 transition-colors" size={140} />
          </div>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full py-20 text-center bento-card border-dashed">
            <Truck size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-brand-text-muted italic font-bold">لا يوجد موردون مسجلون بعد. ابدأ بإضافة مورديك لتسهيل تسيير المخزون!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-4 gap-4 auto-rows-auto animate-in fade-in duration-700">
      {/* Stat 1: Revenue - Spans 1 column */}
      <div className="bento-card flex flex-col justify-between">
        <div className="text-sm font-bold text-brand-text-muted mb-2">إجمالي الدخل (الشهر)</div>
        <div>
          <div className="text-2xl font-black text-brand-text-main">{formatCurrency(stats.totalRevenue)}</div>
          <div className="text-[10px] text-green-500 font-bold mt-1">↑ 12% عن الشهر الماضي</div>
        </div>
      </div>

      {/* Stat 2: Active Repairs - Spans 1 column */}
      <div className="bento-card flex flex-col justify-between">
        <div className="text-sm font-bold text-brand-text-muted mb-2">السيارات في الورشة</div>
        <div>
          <div className="text-2xl font-black text-brand-text-main">{stats.activeTasks}</div>
          <div className="text-[10px] text-brand-text-muted font-bold mt-1">3 جاهزة للتسليم</div>
        </div>
      </div>

      {/* Quick Actions - Spans 1 col, 2 rows */}
      <div className="bento-card md:row-span-2 flex flex-col">
        <div className="text-sm font-bold text-brand-text-muted mb-4 text-center">إجراءات سريعة</div>
        <div className="space-y-2 flex-1 flex flex-col">
          <button 
            onClick={() => { setActiveView('invoices'); handleAdd(); }}
            className="w-full py-3 px-4 bg-brand-accent text-white rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Plus size={16} /> فاتورة جديدة
          </button>
          <button 
            onClick={() => { setActiveView('customers'); handleAdd(); }}
            className="w-full py-3 px-4 bg-slate-500 text-white rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform"
          >
            + إضافة عميل
          </button>
          <button 
            onClick={() => { setActiveView('cars'); }}
            className="w-full py-3 px-4 bg-slate-500 text-white rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform"
          >
            + دخول سيارة
          </button>
          <div className="mt-auto pt-4 text-center text-[10px] text-brand-text-muted italic">
            التحديث الأخير: {new Date().toLocaleTimeString('ar-SA')}
          </div>
        </div>
      </div>

      {/* Performance Card - Spans 1 col, 1 row (Accent Background) */}
      <div className="bento-card bg-brand-accent text-white border-0 flex flex-col items-center justify-center text-center">
        <div className="text-[10px] uppercase font-bold text-white/70 tracking-widest mb-1">أداء الورشة</div>
        <div className="text-4xl font-black mb-1">94%</div>
        <div className="text-[10px] font-bold">معدل رضا العملاء</div>
      </div>

      {/* Inventory Alerts - Spans 2 cols, 2 rows */}
      <div className="bento-card md:col-span-2 md:row-span-2 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-brand-text-muted">تنبيهات المخزون (قطع غيار)</h3>
          <Package size={18} className="text-brand-text-muted" />
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="pb-2 font-bold text-brand-text-muted text-xs">القطعة</th>
                <th className="pb-2 font-bold text-brand-text-muted text-xs">الكمية</th>
                <th className="pb-2 font-bold text-brand-text-muted text-xs">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {parts.length > 0 ? parts.filter(p => p.quantity <= p.minQuantity).map(part => {
                const isCritical = part.quantity <= (part.minQuantity * 0.3) || part.quantity === 0;
                return (
                  <tr key={part.id}>
                    <td className="py-3 font-medium">{part.name}</td>
                    <td className={cn(
                      "py-3 font-bold",
                      isCritical ? "text-red-500" : "text-amber-500"
                    )}>
                      {part.quantity} قطع
                    </td>
                    <td className="py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        isCritical 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {isCritical ? 'حرج' : 'منخفض'}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-brand-text-muted italic text-xs">
                    مستوى المخزون ممتاز حالياً!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operations Card - Spans 2 cols, 2 rows */}
      <div className="bento-card md:col-span-2 md:row-span-2 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-brand-text-muted">العمليات الجارية</h3>
          <CarFront size={18} className="text-brand-text-muted" />
        </div>
        <div className="flex-1">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="pb-2 font-bold text-brand-text-muted">السيارة</th>
                <th className="pb-2 font-bold text-brand-text-muted">العميل</th>
                <th className="pb-2 font-bold text-brand-text-muted">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border border-b border-dashed border-brand-border/50">
               <tr>
                <td className="py-3 font-bold">Volkswagen Golf 7</td>
                <td className="py-3 text-brand-text-muted">أحمد بن علي</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">قيد التصليح</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold">Hyundai Tucson</td>
                <td className="py-3 text-brand-text-muted">عمر فاروق</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold">انتظار قطع</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Invoices - Spans 3 cols, 1 row */}
      <div className="bento-card md:col-span-3 flex flex-col md:flex-row items-center gap-4">
        <div className="text-sm font-bold text-brand-text-muted min-w-[100px]">آخر الفواتير</div>
        <div className="flex-1 w-full space-y-2">
          {invoices.length > 0 ? invoices.slice(-2).map(inv => (
             <div key={inv.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-brand-border/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-brand-border shadow-xs"><FileText size={14} className="text-brand-accent" /></div>
                  <div className="text-xs">
                    <p className="font-black text-brand-text-main">{inv.invoiceNumber}</p>
                    <p className="text-[10px] text-brand-text-muted">العميل: {customers.find(c => c.id === inv.customerId)?.name || 'غير معروف'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="font-bold text-sm">{formatCurrency(inv.totalAmount)}</span>
                   <div className="text-brand-accent cursor-pointer text-[10px] font-bold flex items-center gap-1 hover:underline">عرض <ChevronRight size={12} className="rotate-180" /></div>
                </div>
             </div>
          )) : (
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-brand-border/30 w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-brand-border"><FileText size={14} className="text-brand-accent" /></div>
                <div className="text-xs">
                  <p className="font-black text-brand-text-main">#INV-2026-001</p>
                  <p className="text-[10px] text-brand-text-muted">العميل: محمد أمين</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className="font-bold text-sm">1,250.00 SAR</span>
                 <div className="text-brand-accent cursor-pointer text-[10px] font-bold flex items-center gap-1">عرض <ChevronRight size={12} className="rotate-180" /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => {
    const columns = [
      { id: 'name', label: 'الاسم والبريد' },
      { id: 'contact', label: 'الاتصال والواتساب' },
      { id: 'date', label: 'تاريخ التسجيل' },
      { id: 'location', label: 'الموقع والعنوان' },
      { id: 'cars', label: 'عدد المركبات' },
      { id: 'actions', label: 'الإجراءات' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">إدارة العملاء</h2>
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> إضافة عميل جديد
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="بحث عن عميل بالاسم أو الهاتف..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowColumnPicker(showColumnPicker === 'customers' ? null : 'customers')}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 transition-colors"
              title="تخصيص الأعمدة"
            >
              <Columns size={20} />
            </button>
            {showColumnPicker === 'customers' && renderColumnPicker('customers', columns, customerVisibleColumns, setCustomerVisibleColumns)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-right divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {customerVisibleColumns.includes('name') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right">الاسم</th>}
                {customerVisibleColumns.includes('contact') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right">الاتصال</th>}
                {customerVisibleColumns.includes('date') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right text-center">تاريخ التسجيل</th>}
                {customerVisibleColumns.includes('location') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right">الموقع</th>}
                {customerVisibleColumns.includes('cars') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right text-center">المركبات</th>}
                {customerVisibleColumns.includes('actions') && <th className="px-6 py-4 text-sm font-bold text-slate-500 text-right">الإجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {([...customers])
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm))
                .map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  {customerVisibleColumns.includes('name') && (
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-[10px] text-slate-400">{customer.email || 'لا يوجد بريد'}</div>
                    </td>
                  )}
                  {customerVisibleColumns.includes('contact') && (
                    <td className="px-6 py-4">
                      <div className="text-slate-600 font-bold text-sm tracking-tighter">{customer.phone}</div>
                      {customer.whatsapp && (
                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                           <MessageCircle size={10} /> واتساب
                        </div>
                      )}
                    </td>
                  )}
                  {customerVisibleColumns.includes('date') && (
                    <td className="px-6 py-4 text-center">
                      <div className="text-xs font-bold text-slate-500">{formatDate(customer.createdAt)}</div>
                    </td>
                  )}
                  {customerVisibleColumns.includes('location') && (
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 font-black">{customer.wilaya}</div>
                      <div className="text-[10px] text-slate-400">{customer.commune}</div>
                      <div className="text-[10px] text-slate-300 truncate max-w-[150px]">{customer.address}</div>
                    </td>
                  )}
                  {customerVisibleColumns.includes('cars') && (
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                        <CarFront size={14} />
                        <span className="text-xs font-black">{cars.filter(car => car.customerId === customer.id).length}</span>
                      </div>
                    </td>
                  )}
                  {customerVisibleColumns.includes('actions') && (
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete('customer', customer.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderParts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-text-main">مخزون قطع الغيار</h2>
        <button 
          onClick={handleAdd}
          className="bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-brand-accent/20 font-bold"
        >
          <Plus size={20} /> إضافة قطعة غيار
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="بحث في المخزون بالاسم أو SKU..."
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-accent/10 bg-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bento-card !p-0 overflow-hidden">
        <table className="w-full text-right divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">اسم القطعة</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">SKU</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">المورد</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">الكمية</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">سعر البيع</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase">الحالة</th>
              <th className="px-6 py-4 text-xs font-black text-brand-text-muted uppercase text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {parts.filter(p => p.name.includes(searchTerm) || p.sku.includes(searchTerm)).map(part => (
              <tr key={part.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-black text-brand-text-main">{part.name}</td>
                <td className="px-6 py-4 text-xs font-bold text-brand-text-muted font-mono">{part.sku}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-600">
                  {suppliers.find(s => s.id === part.supplierId)?.name || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-brand-text-main">{part.quantity}</td>
                <td className="px-6 py-4 font-black text-brand-accent">{formatCurrency(part.price)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tighter",
                    part.quantity === 0
                      ? "bg-slate-900 text-white border-slate-900"
                      : part.quantity <= (part.minQuantity * 0.3)
                        ? "bg-red-50 text-red-600 border-red-100"
                        : part.quantity <= part.minQuantity
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-green-50 text-green-600 border-green-100"
                  )}>
                    {part.quantity === 0 
                      ? 'نفذ المخزون' 
                      : part.quantity <= (part.minQuantity * 0.3) 
                        ? 'مخزون حرج' 
                        : part.quantity <= part.minQuantity 
                          ? 'مخزون منخفض' 
                          : 'متوفر'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 justify-end">
                    <button 
                      onClick={() => handleEdit(part)}
                      className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete('part', part.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {parts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center text-brand-text-muted italic font-bold">
                  لا توجد قطع غيار مسجلة. ابدأ بإضافة مخزونك!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bento-card">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Settings className="text-brand-accent" /> إعدادات الورشة الأساسية
        </h3>
        <form 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            const logoFile = formData.get('logo') as File;
            let logoUrl = settings.logoUrl;
            
            if (logoFile && logoFile.size > 0) {
              logoUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(logoFile);
              });
            }

            setSettings({
              name: formData.get('name') as string,
              phone: formData.get('phone') as string,
              email: formData.get('email') as string,
              address: formData.get('address') as string,
              currency: formData.get('currency') as string,
              taxRate: Number(formData.get('taxRate')),
              invoicePrefix: formData.get('invoicePrefix') as string,
              logoUrl: logoUrl,
              primaryColor: formData.get('primaryColor') as string,
              secondaryColor: formData.get('secondaryColor') as string,
            });
            alert('تم حفظ الإعدادات بنجاح');
          }}
        >
          <div className="md:col-span-2 space-y-4 pb-6 border-b border-brand-border/50">
             <label className="text-sm font-bold text-brand-text-muted">شعار الورشة</label>
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="text-brand-text-muted" size={32} />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="file" name="logo" accept="image/*" className="text-xs text-brand-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-brand-accent/90" />
                  <p className="text-[10px] text-brand-text-muted">يفضل استخدام صورة مربعة بخلفية شفافة (PNG)</p>
                </div>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">اسم الورشة</label>
            <input name="name" defaultValue={settings.name} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">رقم الهاتف</label>
            <input name="phone" defaultValue={settings.phone} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">الالوان المخصصة (للفواتير)</label>
            <div className="flex gap-4">
               <div className="flex-1 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-brand-border">
                  <input type="color" name="primaryColor" defaultValue={settings.primaryColor || '#2563eb'} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                  <span className="text-xs font-bold text-slate-500">اللون الأساسي</span>
               </div>
               <div className="flex-1 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-brand-border">
                  <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor || '#64748b'} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                  <span className="text-xs font-bold text-slate-500">اللون الثانوي</span>
               </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">البريد الإلكتروني</label>
            <input name="email" defaultValue={settings.email} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">العملة</label>
            <input name="currency" defaultValue={settings.currency} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">نسبة الضريبة (%)</label>
            <input name="taxRate" type="number" defaultValue={settings.taxRate} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">بادئة الفاتورة</label>
            <input name="invoicePrefix" defaultValue={settings.invoicePrefix} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-bold text-brand-text-muted">العنوان الكامل</label>
            <textarea name="address" defaultValue={settings.address} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-brand-border outline-none focus:ring-2 focus:ring-brand-accent/20"></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-brand-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-accent/20 hover:scale-[1.02] transition-transform">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>

      <div className="bento-card bg-slate-100/50 border-dashed border-2">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trash2 size={20} className="text-red-500" /> منطقة الخطر
        </h3>
        <p className="text-sm text-brand-text-muted mb-4">سيؤدي هذا الإجراء إلى مسح كافة البيانات المخزنة محلياً في المتصفح. لا يمكن التراجع عن هذا الفعل.</p>
        <button 
          onClick={() => {
            if(confirm('هل أنت متأكد من رغبتك في مسح كافة البيانات؟')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
        >
          مسح كافة البيانات
        </button>
      </div>
    </div>
  );

  const RenderPrintTemplate = ({ invoice }: { invoice: Invoice }) => {
    const customer = customers.find(c => c.id === invoice.customerId);
    const car = cars.find(c => c.id === invoice.carId);
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (settings.taxRate / 100);

    const primaryColor = settings.primaryColor || '#000000';

    return (
      <div className="print-only p-12 bg-white text-black min-h-screen font-sans" dir="rtl">
        <div className="flex justify-between items-start border-b-2 pb-8 mb-8" style={{ borderColor: primaryColor }}>
          <div className="flex gap-6 items-center">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Workshop Logo" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />
            )}
            <div>
              <h1 className="text-4xl font-black mb-2">{settings.name}</h1>
              <p className="text-sm font-bold">{settings.address}</p>
              <p className="text-sm font-bold">هاتف: {settings.phone}</p>
              <p className="text-sm font-bold">بريد: {settings.email}</p>
            </div>
          </div>
          <div className="text-left border-l-2 border-slate-200 pl-8">
            <h2 className="text-2xl font-black mb-1">فاتورة</h2>
            <p className="text-xl font-bold mb-4" style={{ color: primaryColor }}>{invoice.invoiceNumber}</p>
            <p className="text-sm font-bold">التاريخ: {formatDate(invoice.date)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">بيانات العميل</h3>
            <p className="text-2xl font-black">{customer?.name}</p>
            <p className="text-sm font-bold text-slate-600">{customer?.phone}</p>
            <p className="text-sm font-bold text-slate-600">{customer?.address}</p>
          </div>
          {car && (
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">بيانات السيارة</h3>
              <p className="text-2xl font-black uppercase tracking-tight">{car.make} {car.model}</p>
              <p className="text-sm font-bold text-slate-600">رقم اللوحة: {car.plateNumber}</p>
              <p className="text-sm font-bold text-slate-600">سنة الصنع: {car.year}</p>
            </div>
          )}
        </div>

        <table className="w-full mb-10 text-right border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 border border-slate-200">الوصف</th>
              <th className="p-4 border border-slate-200 w-24">الكمية</th>
              <th className="p-4 border border-slate-200 w-32">السعر</th>
              <th className="p-4 border border-slate-200 w-32">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="p-4 border border-slate-200 font-bold">{item.description}</td>
                <td className="p-4 border border-slate-200 text-center">{item.quantity}</td>
                <td className="p-4 border border-slate-200">{formatCurrency(item.unitPrice)}</td>
                <td className="p-4 border border-slate-200 font-bold">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pr-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="font-bold text-slate-500">المجموع الفرعي:</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-500">الضريبة ({settings.taxRate}%):</span>
              <span className="font-bold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-2">
              <span className="text-xl font-black">الإجمالي الكلي:</span>
              <span className="text-xl font-black">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-40 border-t border-slate-200 pt-8 text-center text-xs text-slate-400 font-bold">
          شكرًا لتعاملكم مع {settings.name}. نأمل رؤيتكم قريباً.
        </div>
      </div>
    );
  };

  const RenderInspectionPrintTemplate = ({ car }: { car: Car }) => {
    const customer = customers.find(c => c.id === car.customerId);
    const inspection = car.inspection;
    if (!inspection) return null;

    const primaryColor = settings.primaryColor || '#000000';

    return (
      <div className="print-only p-12 bg-white text-black min-h-screen font-sans" dir="rtl">
        <div className="flex justify-between items-start border-b-2 pb-8 mb-8" style={{ borderColor: primaryColor }}>
          <div className="flex gap-6 items-center">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Workshop Logo" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
            )}
            <div>
              <h1 className="text-4xl font-black mb-2">تقرير معاينة مركبة</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Vehicle Reception Inspection</p>
            </div>
          </div>
          <div className="text-left ltr">
             <h2 className="text-2xl font-black" style={{ color: primaryColor }}>{settings.name}</h2>
             <p className="text-sm font-bold opacity-70">{settings.phone}</p>
             <p className="text-sm font-bold opacity-70">{settings.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
           <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 border-b border-slate-100 pb-2">تفاصيل المركبة</h3>
              <div className="grid grid-cols-2 gap-y-3">
                 <div>
                    <span className="text-[10px] block font-black text-slate-400">النوع</span>
                    <span className="font-bold">{car.make} {car.model}</span>
                 </div>
                 <div>
                    <span className="text-[10px] block font-black text-slate-400">رقم اللوحة</span>
                    <span className="font-bold">{car.plateNumber}</span>
                 </div>
                 <div>
                    <span className="text-[10px] block font-black text-slate-400">سنة الصنع</span>
                    <span className="font-bold">{car.year}</span>
                 </div>
                 <div>
                    <span className="text-[10px] block font-black text-slate-400">رقم الهيكل</span>
                    <span className="font-mono text-sm">{car.vin || 'N/A'}</span>
                 </div>
              </div>
           </div>
           <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 border-b border-slate-100 pb-2">بيانات العميل</h3>
              <div>
                 <span className="text-[10px] block font-black text-slate-400">اسم العميل</span>
                 <span className="font-bold text-lg">{customer?.name}</span>
              </div>
              <div>
                 <span className="text-[10px] block font-black text-slate-400">تاريخ المعاينة</span>
                 <span className="font-bold">{inspection.inspectionDate ? formatDate(inspection.inspectionDate) : formatDate(new Date())}</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-10">
           <h3 className="text-lg font-black mb-6 flex items-center gap-2">
             <ShieldCheck size={20} className="text-brand-accent" />
             حالة المركبة المحللة
           </h3>
           <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">الهيكل الخارجي</p>
                 <p className={cn("text-xl font-bold uppercase", 
                   inspection.bodyCondition === 'excellent' ? 'text-green-600' : 'text-orange-500'
                 )}>{inspection.bodyCondition === 'excellent' ? 'ممتاز' : 
                     inspection.bodyCondition === 'good' ? 'جيد' : 
                     inspection.bodyCondition === 'fair' ? 'متوسط' : 'سيء'}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">أداء المحرك</p>
                 <p className={cn("text-xl font-bold uppercase", 
                   inspection.engineStatus === 'excellent' ? 'text-green-600' : 'text-orange-500'
                 )}>{inspection.engineStatus === 'excellent' ? 'ممتاز' : 
                     inspection.engineStatus === 'good' ? 'جيد' : 
                     inspection.engineStatus === 'fair' ? 'متوسط' : 'سيء'}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">الحالة الداخلية</p>
                 <p className={cn("text-xl font-bold uppercase", 
                   inspection.interiorCondition === 'excellent' ? 'text-green-600' : 'text-orange-500'
                 )}>{inspection.interiorCondition === 'excellent' ? 'ممتاز' : 
                     inspection.interiorCondition === 'good' ? 'جيد' : 
                     inspection.interiorCondition === 'fair' ? 'متوسط' : 'سيء'}</p>
              </div>
           </div>
           
           <div className="mt-8">
              <p className="text-xs font-black text-slate-400 uppercase mb-2">ملاحظات فنية شاملة</p>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 min-h-[120px] italic text-slate-600">
                 {inspection.notes || 'لا توجد ملاحظات إضافية مسجلة.'}
              </div>
           </div>

           <div className="mt-6 flex justify-between items-end">
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase mb-1">عداد المسافة عند الاستلام</p>
                 <p className="text-2xl font-black text-brand-text-main tracking-tight">{inspection.mileage || 'غير محدد'}</p>
              </div>
           </div>
        </div>

        {car.photos && car.photos.length > 0 && (
          <div className="page-break-before pt-10">
             <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Camera size={20} className="text-brand-accent" />
                التوثيق البصري للمركبة (Vehicle Photos)
             </h3>
             <div className="grid grid-cols-2 gap-4">
                {car.photos.map((photo, i) => (
                  <div key={i} className="aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-xl">
                    <img src={photo} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="mt-20 flex justify-between gap-12">
            <div className="flex-1 text-center">
               <div className="border-t border-slate-900 pt-4">
                  <p className="text-xs font-black text-slate-400 uppercase">توقيع المسؤول والختم الرسمي</p>
               </div>
            </div>
            <div className="flex-1 text-center">
               <div className="border-t border-slate-900 pt-4">
                  <p className="text-xs font-black text-slate-400 uppercase">موافقة العميل وتوقيعه الاستلام</p>
               </div>
            </div>
        </div>
      </div>
    );
  };

  const renderColumnPicker = (type: 'customers' | 'invoices', columns: { id: string; label: string }[], current: string[], setter: (cols: string[]) => void) => (
    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in duration-200">
      <div className="text-[10px] font-black text-brand-text-muted uppercase px-2 mb-2">تخصيص الأعمدة</div>
      <div className="space-y-1">
        {columns.map(col => (
          <button
            key={col.id}
            onClick={() => {
              const next = current.includes(col.id)
                ? current.filter(id => id !== col.id)
                : [...current, col.id];
              if (next.length > 0) setter(next);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold transition-all",
              current.includes(col.id) ? "bg-brand-accent/5 text-brand-accent" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {col.label}
            {current.includes(col.id) && <ShieldCheck size={12} />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col md:flex-row rtl transition-all duration-500" dir="rtl">
      {/* Print View */}
      {printInvoice && <RenderPrintTemplate invoice={printInvoice} />}
      {printInspection && <RenderInspectionPrintTemplate car={printInspection} />}

      {/* Sidebar */}
      <aside className="no-print w-full md:w-64 bg-brand-sidebar text-white flex flex-col z-20 shadow-xl overflow-hidden">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/30 animate-pulse">
              <Settings size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">{settings.name}</h1>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest leading-none mt-1">Smart Workshop</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                setSearchTerm('');
                setFilterBrand('');
                setFilterModel('');
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm",
                activeView === item.id 
                  ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20 translate-x-1" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeView === item.id && <motion.div layoutId="active" className="mr-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-[10px] font-black">AI</div>
              <p className="text-[10px] text-white/80 font-bold italic">نظام المساعد الذكي نشط</p>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="no-print flex-1 overflow-y-auto p-6 md:p-10 relative">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></div>
               <span className="text-[10px] font-black text-brand-accent uppercase tracking-tighter">Live Dashboard</span>
            </div>
            <h2 className="text-3xl font-black text-brand-text-main tracking-tight">{navItems.find(i => i.id === activeView)?.label}</h2>
            <p className="text-brand-text-muted text-sm font-medium mt-1">أهلاً بك مجدداً في نظام تسيير الورشة المتكامل</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2.5 rounded-2xl border border-brand-border shadow-sm flex items-center gap-3">
                <div className="text-left leading-none">
                  <p className="text-sm font-black text-brand-text-main">فؤاد بودوخة</p>
                  <p className="text-[10px] text-brand-text-muted font-bold mt-1 uppercase">Admin Access</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-blue-700 flex items-center justify-center font-bold text-white shadow-md">
                  FB
                </div>
             </div>
          </div>
        </header>

        <div className="max-w-7xl">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'customers' && renderCustomers()}
          {activeView === 'parts' && renderParts()}
          {activeView === 'settings' && renderSettings()}
          {activeView === 'cars' && renderCars()}
          {activeView === 'suppliers' && renderSuppliers()}
          {activeView === 'invoices' && renderInvoices()}
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "bg-white rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-200",
                activeView === 'invoices' ? "w-full max-w-4xl" : "w-full max-w-lg"
              )}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingItem ? 'تعديل' : 'إضافة'} {activeView === 'customers' ? 'عميل' : activeView === 'parts' ? 'قطعة غيار' : activeView === 'cars' ? 'سيارة' : activeView === 'suppliers' ? 'مورد' : 'فاتورة'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {activeView === 'invoices' ? (
                <div className="p-6">{renderInvoiceForm()}</div>
              ) : (
                <form 
                  className="p-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    
                    if (activeView === 'customers') {
                      if (editingItem) {
                        setCustomers(prev => prev.map(c => c.id === editingItem.id ? {
                          ...c,
                          name: formData.get('name') as string,
                          phone: formData.get('phone') as string,
                          email: formData.get('email') as string,
                          whatsapp: formData.get('whatsapp') as string,
                          wilaya: formData.get('wilaya') as string,
                          commune: formData.get('commune') as string,
                          address: formData.get('address') as string,
                        } : c));
                      } else {
                        const newCustomer: Customer = {
                          id: Math.random().toString(36).substr(2, 9),
                          name: formData.get('name') as string,
                          phone: formData.get('phone') as string,
                          email: formData.get('email') as string,
                          whatsapp: formData.get('whatsapp') as string,
                          wilaya: formData.get('wilaya') as string,
                          commune: formData.get('commune') as string,
                          address: formData.get('address') as string,
                          createdAt: new Date().toISOString()
                        };
                        setCustomers(prev => [...prev, newCustomer]);
                      }
                    } else if (activeView === 'parts') {
                      if (editingItem) {
                        setParts(prev => prev.map(p => p.id === editingItem.id ? {
                          ...p,
                          name: formData.get('name') as string,
                          sku: formData.get('sku') as string,
                          supplierId: formData.get('supplierId') as string,
                          price: Number(formData.get('price')),
                          cost: Number(formData.get('cost')),
                          quantity: Number(formData.get('quantity')),
                          minQuantity: Number(formData.get('minQuantity')),
                        } : p));
                      } else {
                        const newPart: Part = {
                          id: Math.random().toString(36).substr(2, 9),
                          name: formData.get('name') as string,
                          sku: formData.get('sku') as string,
                          supplierId: formData.get('supplierId') as string,
                          price: Number(formData.get('price')),
                          cost: Number(formData.get('cost')),
                          quantity: Number(formData.get('quantity')),
                          minQuantity: Number(formData.get('minQuantity')),
                        };
                        setParts(prev => [...prev, newPart]);
                      }
                    } else if (activeView === 'cars') {
                      const makeValue = formData.get('make') === 'Other' ? formData.get('make_custom') : formData.get('make');
                      const modelValue = formData.get('model') === 'Other' ? formData.get('model_custom') : formData.get('model');
                      
                      const inspectionData = {
                        bodyCondition: formData.get('bodyCondition') as any,
                        engineStatus: formData.get('engineStatus') as any,
                        interiorCondition: formData.get('interiorCondition') as any,
                        mileage: formData.get('mileage') as string,
                        notes: formData.get('inspectionNotes') as string,
                        inspectionDate: new Date().toISOString()
                      };

                      if (editingItem) {
                        setCars(prev => prev.map(c => c.id === editingItem.id ? {
                          ...c,
                          customerId: formData.get('customerId') as string,
                          make: makeValue as string,
                          model: modelValue as string,
                          year: formData.get('year') as string,
                          plateNumber: formData.get('plateNumber') as string,
                          vin: formData.get('vin') as string,
                          photos: carPhotos,
                          inspection: inspectionData,
                          maintenanceHistory: currentCarHistory
                        } : c));
                      } else {
                        const newCar: Car = {
                          id: Math.random().toString(36).substr(2, 9),
                          customerId: formData.get('customerId') as string,
                          make: makeValue as string,
                          model: modelValue as string,
                          year: formData.get('year') as string,
                          plateNumber: formData.get('plateNumber') as string,
                          vin: formData.get('vin') as string,
                          photos: carPhotos,
                          inspection: inspectionData,
                          maintenanceHistory: currentCarHistory
                        };
                        setCars(prev => [...prev, newCar]);
                      }
                    } else if (activeView === 'suppliers') {
                      if (editingItem) {
                        setSuppliers(prev => prev.map(s => s.id === editingItem.id ? {
                          ...s,
                          name: formData.get('name') as string,
                          contactName: formData.get('contactName') as string,
                          phone: formData.get('phone') as string,
                          email: formData.get('email') as string,
                        } : s));
                      } else {
                        const newSupplier: Supplier = {
                          id: Math.random().toString(36).substr(2, 9),
                          name: formData.get('name') as string,
                          contactName: formData.get('contactName') as string,
                          phone: formData.get('phone') as string,
                          email: formData.get('email') as string,
                        };
                        setSuppliers(prev => [...prev, newSupplier]);
                      }
                    }
                    setIsModalOpen(false);
                  }}
                >
                   {activeView === 'customers' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">اسم العميل</label>
                          <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="الاسم الكامل" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">رقم الهاتف</label>
                          <input name="phone" defaultValue={editingItem?.phone} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="0XXXXXXXXX" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">البريد الإلكتروني</label>
                          <input name="email" type="email" defaultValue={editingItem?.email} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="example@mail.com" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">رقم الواتساب (اختياري)</label>
                          <input name="whatsapp" defaultValue={editingItem?.whatsapp} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="0XXXXXXXXX" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">الولاية (الجزائر)</label>
                          <select name="wilaya" defaultValue={editingItem?.wilaya} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none">
                            <option value="">اختر الولاية...</option>
                            {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">البلدية</label>
                          <input name="commune" defaultValue={editingItem?.commune} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="اسم البلدية" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-600 block">العنوان بالتفصيل</label>
                        <textarea name="address" defaultValue={editingItem?.address} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" rows={2} placeholder="رقم الباب، الحي، الشارع..."></textarea>
                      </div>
                    </>
                  ) : activeView === 'parts' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">اسم القطعة</label>
                          <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">SKU / الكود</label>
                          <input name="sku" defaultValue={editingItem?.sku} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-600 block">المورد</label>
                        <select name="supplierId" defaultValue={editingItem?.supplierId} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
                          <option value="">اختر مورداً...</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">التكلفة</label>
                          <input name="cost" type="number" defaultValue={editingItem?.cost} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">سعر البيع</label>
                          <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">الكمية الحالية</label>
                          <input name="quantity" type="number" defaultValue={editingItem?.quantity} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">الحد الأدنى</label>
                          <input name="minQuantity" type="number" defaultValue={editingItem?.minQuantity} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                        </div>
                      </div>
                    </>
                  ) : activeView === 'cars' ? (
                    <div className="space-y-4">
                      {/* Car Modal Tabs */}
                      <div className="flex border-b border-slate-100">
                        <button 
                          type="button"
                          onClick={() => setActiveCarModalTab('details')}
                          className={cn(
                            "px-4 py-2 text-sm font-black transition-colors border-b-2",
                            activeCarModalTab === 'details' ? "border-brand-accent text-brand-accent" : "border-transparent text-slate-400"
                          )}
                        >
                          بيانات السيارة
                        </button>
                        <button 
                          type="button"
                          onClick={() => setActiveCarModalTab('inspection')}
                          className={cn(
                            "px-4 py-2 text-sm font-black transition-colors border-b-2",
                            activeCarModalTab === 'inspection' ? "border-brand-accent text-brand-accent" : "border-transparent text-slate-400"
                          )}
                        >
                          المعاينة
                        </button>
                        <button 
                          type="button"
                          onClick={() => setActiveCarModalTab('history')}
                          className={cn(
                            "px-4 py-2 text-sm font-black transition-colors border-b-2",
                            activeCarModalTab === 'history' ? "border-brand-accent text-brand-accent" : "border-transparent text-slate-400"
                          )}
                        >
                          سجل الصيانة
                        </button>
                      </div>

                      <div className={activeCarModalTab === 'details' ? 'space-y-4' : 'hidden'}>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">مالك السيارة (العميل)</label>
                          <select name="customerId" defaultValue={editingItem?.customerId} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
                            <option value="">اختر عميلاً...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">الماركة (المصنع)</label>
                            <select 
                              name="make" 
                              value={formSelectedBrand} 
                              onChange={(e) => setFormSelectedBrand(e.target.value)}
                              required 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                            >
                              <option value="">اختر الماركة...</option>
                              {Object.keys(CAR_DATA).sort().map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                              ))}
                              <option value="Other">ماركة أخرى...</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">الموديل</label>
                            {formSelectedBrand && CAR_DATA[formSelectedBrand] ? (
                              <select 
                                name="model" 
                                value={formSelectedModel}
                                onChange={(e) => setFormSelectedModel(e.target.value)}
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                              >
                                <option value="">اختر الموديل...</option>
                                {CAR_DATA[formSelectedBrand].map(model => (
                                  <option key={model} value={model}>{model}</option>
                                ))}
                                <option value="Other">موديل آخر...</option>
                              </select>
                            ) : (
                              <input 
                                name="model" 
                                defaultValue={editingItem?.model} 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" 
                                placeholder="أدخل الموديل يدوياً" 
                              />
                            )}
                          </div>
                        </div>
                        {formSelectedBrand === 'Other' && (
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">اسم الماركة يدوياً</label>
                            <input 
                              name="make_custom" 
                              defaultValue={editingItem?.make}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" 
                              placeholder="أدخل اسم الماركة" 
                            />
                          </div>
                        )}
                        {(formSelectedBrand === 'Other' || formSelectedModel === 'Other' || (editingItem && !CAR_DATA[formSelectedBrand])) && (
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">الموديل يدوياً</label>
                            <input 
                              name="model_custom" 
                              defaultValue={editingItem && !CAR_DATA[formSelectedBrand] ? editingItem.model : editingItem?.model === 'Other' ? '' : editingItem?.model}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" 
                              placeholder="أدخل اسم الموديل" 
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">سنة الصنع</label>
                            <input name="year" defaultValue={editingItem?.year} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="2024" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600 block">رقم اللوحة</label>
                            <input name="plateNumber" defaultValue={editingItem?.plateNumber} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="ABC-1234" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">رقم الهيكل (VIN)</label>
                          <input name="vin" defaultValue={editingItem?.vin} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none font-mono" placeholder="رقم الهيكل التسلسلي" />
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="text-md font-black text-brand-text-main mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-brand-accent" />
                            صور المركبة (الحد الأقصى 1MB لكل صورة)
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {carPhotos.map((photo, i) => (
                              <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                <img src={photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <button 
                                  type="button"
                                  onClick={() => setCarPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-accent hover:bg-brand-accent/5 transition-all group">
                              <Camera size={20} className="text-slate-300 group-hover:text-brand-accent" />
                              <span className="text-[8px] font-black text-slate-400 group-hover:text-brand-accent uppercase">إضافة صورة</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className={activeCarModalTab === 'inspection' ? 'space-y-4' : 'hidden'}>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-brand-border/50">
                          <h4 className="text-md font-black text-brand-text-main mb-4 flex items-center gap-2">
                            <ClipboardCheck size={20} className="text-brand-accent" />
                            حالة المركبة عند الاستقبال
                          </h4>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-brand-text-muted block uppercase">الهيكل</label>
                              <select name="bodyCondition" defaultValue={editingItem?.inspection?.bodyCondition || 'good'} className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-slate-200 outline-none">
                                <option value="excellent">ممتاز</option>
                                <option value="good">جيد</option>
                                <option value="fair">متوسط</option>
                                <option value="poor">سيء</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-brand-text-muted block uppercase">المحرك</label>
                              <select name="engineStatus" defaultValue={editingItem?.inspection?.engineStatus || 'good'} className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-slate-200 outline-none">
                                <option value="excellent">ممتاز</option>
                                <option value="good">جيد</option>
                                <option value="fair">متوسط</option>
                                <option value="poor">سيء</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-brand-text-muted block uppercase">الداخل</label>
                              <select name="interiorCondition" defaultValue={editingItem?.inspection?.interiorCondition || 'good'} className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-slate-200 outline-none">
                                <option value="excellent">ممتاز</option>
                                <option value="good">جيد</option>
                                <option value="fair">متوسط</option>
                                <option value="poor">سيء</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600 block">عداد المسافة</label>
                              <input name="mileage" defaultValue={editingItem?.inspection?.mileage} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none" placeholder="120,000 كم" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600 block">ملاحظات المعاينة</label>
                              <textarea name="inspectionNotes" defaultValue={editingItem?.inspection?.notes} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none h-24" placeholder="اكتب ملاحظات المعاينة هنا..." />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={activeCarModalTab === 'history' ? 'space-y-4' : 'hidden'}>
                        {currentCarHistory.length > 0 && (
                          <div className="bg-brand-accent/5 p-4 rounded-2xl border border-brand-accent/10 flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                 <Package size={20} />
                               </div>
                               <div>
                                 <p className="text-[10px] font-black text-brand-text-muted uppercase">إجمالي تكاليف الصيانة</p>
                                 <p className="text-xl font-black text-brand-text-main">
                                   {formatCurrency(currentCarHistory.reduce((sum, h) => sum + (h.cost || 0), 0))}
                                 </p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className="text-[10px] font-black text-brand-text-muted uppercase">عدد العمليات</p>
                               <p className="text-xl font-black text-brand-accent">{currentCarHistory.length}</p>
                             </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-0">
                           <h4 className="text-sm font-black text-brand-text-main flex items-center gap-2">
                             <History size={16} className="text-brand-accent" /> سجل عمليات الصيانة
                           </h4>
                           <button 
                             type="button"
                             onClick={() => setShowAddMaintenance(!showAddMaintenance)}
                             className="text-[10px] font-black bg-brand-accent/10 text-brand-accent px-3 py-1.5 rounded-lg hover:bg-brand-accent/20 transition-colors"
                           >
                             {showAddMaintenance ? 'إلغاء' : '+ إضافة سجل'}
                           </button>
                        </div>

                        {showAddMaintenance && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-brand-accent/20 space-y-3 animate-in slide-in-from-top-2 duration-300">
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-brand-text-muted uppercase">التاريخ</label>
                                   <input 
                                     type="date" 
                                     value={newMaintenance.date}
                                     onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
                                     className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none" 
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-brand-text-muted uppercase">نوع الخدمة</label>
                                   <input 
                                     type="text" 
                                     placeholder="تغيير زيت، فحص، إلخ"
                                     value={newMaintenance.type}
                                     onChange={(e) => setNewMaintenance({...newMaintenance, type: e.target.value})}
                                     className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none" 
                                   />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-brand-text-muted uppercase">قطع الغيار المستخدمة</label>
                                   <input 
                                     type="text" 
                                     placeholder="فلتر زيت، 5 لتر زيت..."
                                     value={newMaintenance.parts}
                                     onChange={(e) => setNewMaintenance({...newMaintenance, parts: e.target.value})}
                                     className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none" 
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-brand-text-muted uppercase">التكلفة</label>
                                   <input 
                                     type="number" 
                                     placeholder="0.00"
                                     value={newMaintenance.cost || ''}
                                     onChange={(e) => setNewMaintenance({...newMaintenance, cost: Number(e.target.value)})}
                                     className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none" 
                                   />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-black text-brand-text-muted uppercase">ملاحظات</label>
                                <textarea 
                                  placeholder="ملاحظات إضافية..."
                                  value={newMaintenance.notes}
                                  onChange={(e) => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none h-16"
                                />
                             </div>
                             <button 
                               type="button"
                               onClick={() => {
                                 if(!newMaintenance.type || !newMaintenance.date) return alert('يرجى ملء نوع الخدمة والتاريخ');
                                 const item: MaintenanceHistory = {
                                   ...newMaintenance,
                                   id: Math.random().toString(36).substr(2, 9)
                                 };
                                 setCurrentCarHistory([item, ...currentCarHistory]);
                                 setNewMaintenance({
                                   date: new Date().toISOString().split('T')[0],
                                   type: '',
                                   parts: '',
                                   cost: 0,
                                   notes: ''
                                 });
                                 setShowAddMaintenance(false);
                               }}
                               className="w-full bg-brand-accent text-white py-2 rounded-lg text-xs font-black shadow-lg shadow-brand-accent/20"
                             >
                               إضافة للسجل
                             </button>
                          </div>
                        )}

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <div className="flex gap-2 mb-2">
                             <div className="relative flex-1">
                               <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                               <input 
                                 type="text" 
                                 placeholder="بحث في السجل..."
                                 value={historySearchTerm}
                                 onChange={(e) => setHistorySearchTerm(e.target.value)}
                                 className="w-full pr-7 pl-3 py-2 text-[10px] rounded-lg border border-slate-200 outline-none"
                               />
                             </div>
                             <select 
                               className="text-[10px] px-2 py-2 rounded-lg border border-slate-200 outline-none font-bold"
                               value={`${historySortKey}-${historySortOrder}`}
                               onChange={(e) => {
                                 const [key, order] = e.target.value.split('-') as [any, any];
                                 setHistorySortKey(key);
                                 setHistorySortOrder(order);
                               }}
                             >
                               <option value="date-desc">التاريخ (الأحدث)</option>
                               <option value="date-asc">التاريخ (الأقدم)</option>
                               <option value="cost-desc">التكلفة (الأعلى)</option>
                               <option value="cost-asc">التكلفة (الأقل)</option>
                             </select>
                          </div>

                          {currentCarHistory
                            .filter(h => h.type.includes(historySearchTerm) || h.parts.includes(historySearchTerm) || (h.notes || '').includes(historySearchTerm))
                            .sort((a, b) => {
                              if (historySortKey === 'date') {
                                return historySortOrder === 'desc' 
                                  ? new Date(b.date).getTime() - new Date(a.date).getTime()
                                  : new Date(a.date).getTime() - new Date(b.date).getTime();
                              } else {
                                return historySortOrder === 'desc' ? b.cost - a.cost : a.cost - b.cost;
                              }
                            })
                            .map(item => (
                            <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:border-brand-accent/30 transition-colors relative group">
                               <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-black text-brand-accent">{formatDate(item.date)}</span>
                                  <span className="text-xs font-black text-slate-900">{formatCurrency(item.cost)}</span>
                               </div>
                               <h5 className="text-sm font-black text-brand-text-main mb-1">{item.type}</h5>
                               {item.parts && (
                                 <p className="text-[10px] text-brand-text-muted font-bold mb-1">
                                   <Package size={10} className="inline mr-1" /> {item.parts}
                                 </p>
                               )}
                               {item.notes && (
                                 <p className="text-[10px] text-slate-400 italic font-medium">{item.notes}</p>
                               )}
                               <button 
                                 type="button"
                                 onClick={() => setCurrentCarHistory(prev => prev.filter(h => h.id !== item.id))}
                                 className="absolute top-2 left-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 <Trash2 size={12} />
                               </button>
                            </div>
                          ))}
                          {currentCarHistory.length === 0 && (
                            <div className="py-10 text-center text-slate-400 font-bold italic text-xs border-2 border-dashed border-slate-50 rounded-2xl">
                              لا يوجد سجل صيانة لهذه المركبة بعد.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-600 block">اسم المورد / الشركة</label>
                        <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="مثلاً: شركة التوريدات التقنية" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-600 block">اسم مسؤول التواصل</label>
                        <input name="contactName" defaultValue={editingItem?.contactName} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="الاسم الكامل للمسؤول" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">رقم الهاتف</label>
                          <input name="phone" defaultValue={editingItem?.phone} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="0XXXXXXXXX" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-600 block">البريد الإلكتروني</label>
                          <input name="email" type="email" defaultValue={editingItem?.email} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" placeholder="supplier@example.com" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="pt-4 flex gap-3 text-sm">
                    <button type="submit" className="flex-1 bg-brand-accent text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      {editingItem ? 'تحديث البيانات' : 'حفظ'}
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">إلغاء</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
