'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Compass,
  Image as ImageIcon,
  Settings,
  Star,
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  Printer,
  Shield,
  X,
  Save,
  Check,
  Ship,
  Eye,
  AlertCircle,
  UploadCloud,
  UserPlus,
  UserRound,
  LockKeyhole,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Moon,
  Sun,
  Mail,
  MapPin,
  GripHorizontal,
  Minus,
  Maximize2
} from 'lucide-react';
import {
  Language,
  Reservation,
  ReservationStatus,
  PriceTier,
  TourPackage,
  GalleryItem,
  SiteConfig,
  ReviewItem,
  FaqItem,
  AdminRole,
  AdminUser
} from '@/lib/types';
import { translations } from '@/lib/translations';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  reservations: Reservation[];
  onUpdateReservationStatus: (id: string, status: ReservationStatus) => void;
  onUpdateReservation: (res: Reservation) => void;
  onDeleteReservation: (id: string, credentials: { username: string; password: string }) => Promise<boolean>;
  prices: PriceTier[];
  onUpdatePrices: (prices: PriceTier[]) => void;
  tours: TourPackage[];
  onUpdateTours: (tours: TourPackage[]) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (gallery: GalleryItem[]) => void;
  reviews: ReviewItem[];
  onUpdateReviews: (reviews: ReviewItem[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
  onLanguageChange: (lang: Language) => void;
  currentUser: AdminUser;
  users: AdminUser[];
  onUpdateUsers: (users: AdminUser[]) => Promise<void>;
}

type TabType =
  | 'dashboard'
  | 'reservations'
  | 'pricing'
  | 'experiences'
  | 'gallery'
  | 'site'
  | 'reviews'
  | 'roles';

export function AdminPanel({
  isOpen,
  onClose,
  lang,
  siteConfig,
  onUpdateSiteConfig,
  reservations,
  onUpdateReservationStatus,
  onUpdateReservation,
  onDeleteReservation,
  prices,
  onUpdatePrices,
  tours,
  onUpdateTours,
  gallery,
  onUpdateGallery,
  reviews,
  onUpdateReviews,
  faqs,
  onUpdateFaqs,
  onLanguageChange,
  currentUser,
  users,
  onUpdateUsers
}: AdminPanelProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const currentRole = currentUser.role;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'Solo lectura' as AdminRole });
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [deleteCredentials, setDeleteCredentials] = useState({ username: '', password: '' });
  const [deleteAuthError, setDeleteAuthError] = useState(false);

  useEffect(() => {
    setDarkMode(localStorage.getItem('pirates_admin_theme') === 'dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const next = !current;
      localStorage.setItem('pirates_admin_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Reservations Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationWindows, setReservationWindows] = useState<Array<{ id: string; x: number; y: number; z: number; minimized: boolean; maximized: boolean }>>([]);
  const windowZIndex = useRef(1000);
  const dragWindow = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [moduleWindows, setModuleWindows] = useState<Array<{ id: TabType; x: number; y: number; z: number; minimized: boolean; maximized: boolean; docked: boolean }>>([
    { id: 'dashboard', x: 14, y: 14, z: 1, minimized: false, maximized: true, docked: false }
  ]);
  const moduleZIndex = useRef(1);
  const dragModule = useRef<{ id: TabType; offsetX: number; offsetY: number } | null>(null);
  const moduleDesktopRef = useRef<HTMLElement>(null);

  // Editable Form states
  const [tempSiteConfig, setTempSiteConfig] = useState<SiteConfig>({ ...siteConfig });
  const [tempPrices, setTempPrices] = useState<PriceTier[]>([...prices]);
  const [tempTours, setTempTours] = useState<TourPackage[]>([...tours]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Status options as mandated
  const statusOptions: ReservationStatus[] = [
    'Pendiente',
    'Contactado',
    'Confirmado',
    'Depósito pendiente',
    'Pagado',
    'Completado',
    'Cancelado',
    'No se presentó'
  ];

  // Dashboard Metrics Calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayReservations = reservations.filter((r) => r.date === todayStr);
  const upcomingReservations = reservations.filter((r) => r.date >= todayStr);
  const pendingReservations = reservations.filter((r) => r.status === 'Pendiente');
  const confirmedReservations = reservations.filter(
    (r) => r.status === 'Confirmado' || r.status === 'Pagado'
  );
  const cancelledReservations = reservations.filter((r) => r.status === 'Cancelado');

  const totalVisitors = reservations.reduce((acc, r) => acc + (r.adults + r.children), 0);
  const totalEstimatedRevenue = reservations.reduce((acc, r) => acc + r.totalAmount, 0);
  const cruiseReservationsCount = reservations.filter((r) => r.isCruisePassenger).length;
  const transportRequestsCount = reservations.filter((r) => r.needsTransport).length;

  // Filtered reservations for the table
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Código',
      'Fecha Creación',
      'Cliente',
      'Teléfono',
      'Email',
      'Fecha Tour',
      'Hora',
      'Adultos',
      'Niños',
      'Tour',
      'Hospedaje',
      'Barco',
      'Transporte',
      'Estado',
      'Total USD'
    ];

    const rows = filteredReservations.map((r) => [
      r.code,
      r.createdAt,
      `"${r.customerName}"`,
      r.phone,
      r.email,
      r.date,
      r.timeSlot,
      r.adults,
      r.children,
      `"${r.tourName}"`,
      r.lodgingType,
      `"${r.shipName || 'N/A'}"`,
      r.needsTransport ? 'Sí' : 'No',
      r.status,
      r.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reservaciones_pirates_zipline_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(lang === 'es' ? 'Exportación CSV generada con éxito' : 'CSV Export downloaded');
  };

  // Save Site Config Changes
  const handleSaveSiteConfig = () => {
    onUpdateSiteConfig(tempSiteConfig);
    showNotification(lang === 'es' ? 'Configuración del sitio actualizada' : 'Site settings updated');
  };

  // Save Prices Changes
  const handleSavePrices = () => {
    onUpdatePrices(tempPrices);
    showNotification(lang === 'es' ? 'Tarifas guardadas exitosamente' : 'Pricing tiers updated');
  };

  // Save Tours Changes
  const handleSaveTours = () => {
    onUpdateTours(tempTours);
    showNotification(lang === 'es' ? 'Circuitos de tirolesas guardados' : 'Tours updated');
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (files.some((file) => !file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
      showNotification(lang === 'es' ? 'Selecciona imágenes o videos compatibles.' : 'Please select supported images or videos.');
      return;
    }
    setIsUploading(true);
    try {
      const uploads = await Promise.all(files.map(async (file) => {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/admin/upload', { method: 'POST', body });
        if (!response.ok) throw new Error('upload');
        return response.json() as Promise<{ id: string; url: string; type: 'image' | 'video' }>;
      }));
      const created = uploads.map(({ id, url, type }, index): GalleryItem => ({
        id,
        title: { es: files[index].name.replace(/\.[^.]+$/, ''), en: files[index].name.replace(/\.[^.]+$/, '') },
        category: type === 'video' ? 'videos' : 'tirolesas',
        imageUrl: type === 'video' ? '/image/homeweb.jpeg' : url,
        ...(type === 'video' ? { videoUrl: url } : {}),
        isFeatured: false,
        type
      }));
      onUpdateGallery([...created, ...gallery]);
      showNotification(lang === 'es' ? `${created.length} archivo(s) cargado(s)` : `${created.length} media file(s) uploaded`);
    } catch {
      showNotification(lang === 'es' ? 'No se pudo procesar la imagen.' : 'The image could not be processed.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (users.some((user) => user.username.toLowerCase() === newUser.username.trim().toLowerCase())) {
      showNotification(lang === 'es' ? 'Ese usuario ya existe.' : 'That username already exists.');
      return;
    }
    const user: AdminUser = { id: `user-${Date.now()}`, ...newUser, name: newUser.name.trim(), username: newUser.username.trim(), isActive: true, createdAt: new Date().toISOString() };
    await onUpdateUsers([...users, user]);
    setNewUser({ name: '', username: '', password: '', role: 'Solo lectura' });
    showNotification(lang === 'es' ? 'Usuario creado correctamente.' : 'User created successfully.');
  };

  const handleConfirmedReservationDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reservationToDelete) return;
    const deleted = await onDeleteReservation(reservationToDelete.id, deleteCredentials);
    if (!deleted) {
      setDeleteAuthError(true);
      return;
    }
    setReservationWindows((windows) => windows.filter((item) => item.id !== reservationToDelete.id));
    setReservationToDelete(null);
    setDeleteCredentials({ username: '', password: '' });
    setDeleteAuthError(false);
    showNotification(lang === 'es' ? 'Reservación eliminada correctamente.' : 'Reservation deleted successfully.');
  };

  const closeDeleteConfirmation = () => {
    setReservationToDelete(null);
    setDeleteCredentials({ username: '', password: '' });
    setDeleteAuthError(false);
  };

  const openReservationWindow = (reservation: Reservation) => {
    windowZIndex.current += 1;
    setReservationWindows((current) => {
      if (current.some((item) => item.id === reservation.id)) {
        return current.map((item) => item.id === reservation.id ? { ...item, minimized: false, z: windowZIndex.current } : item);
      }
      const offset = current.length % 5;
      return [...current, { id: reservation.id, x: 22 + offset * 28, y: 22 + offset * 28, z: windowZIndex.current, minimized: false, maximized: false }];
    });
  };

  const focusReservationWindow = (id: string) => {
    windowZIndex.current += 1;
    setReservationWindows((current) => current.map((item) => item.id === id ? { ...item, z: windowZIndex.current } : item));
  };

  const startWindowDrag = (event: React.PointerEvent, item: { id: string; x: number; y: number; maximized: boolean }) => {
    if (item.maximized || (event.target as HTMLElement).closest('button')) return;
    const bounds = moduleDesktopRef.current?.getBoundingClientRect();
    focusReservationWindow(item.id);
    dragWindow.current = { id: item.id, offsetX: event.clientX - (bounds?.left || 0) - item.x, offsetY: event.clientY - (bounds?.top || 0) - item.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveReservationWindow = (event: React.PointerEvent) => {
    if (!dragWindow.current || !moduleDesktopRef.current) return;
    const bounds = moduleDesktopRef.current.getBoundingClientRect();
    const { id, offsetX, offsetY } = dragWindow.current;
    const maxX = Math.max(8, bounds.width - 340);
    const maxY = Math.max(8, bounds.height - 56);
    const x = Math.min(maxX, Math.max(0, event.clientX - bounds.left - offsetX));
    const y = Math.min(maxY, Math.max(0, event.clientY - bounds.top - offsetY));
    setReservationWindows((current) => current.map((item) => item.id === id ? { ...item, x, y } : item));
  };

  if (!isOpen) return null;

  const navigationItems = [
    { id: 'dashboard' as TabType, label: t.admin.tabs.dashboard, icon: LayoutDashboard },
    { id: 'reservations' as TabType, label: t.admin.tabs.reservations, icon: Calendar, count: pendingReservations.length },
    { id: 'pricing' as TabType, label: t.admin.tabs.pricing, icon: DollarSign },
    { id: 'experiences' as TabType, label: t.admin.tabs.experiences, icon: Compass },
    { id: 'gallery' as TabType, label: t.admin.tabs.gallery, icon: ImageIcon },
    { id: 'site' as TabType, label: t.admin.tabs.site, icon: Settings },
    { id: 'reviews' as TabType, label: t.admin.tabs.reviews, icon: Star },
    { id: 'roles' as TabType, label: t.admin.tabs.roles, icon: Users }
  ];

  const selectTab = (tab: TabType) => {
    moduleZIndex.current += 1;
    setActiveTab(tab);
    setModuleWindows((current) => {
      if (current.some((item) => item.id === tab)) {
        return current.map((item) => item.id === tab ? { ...item, minimized: false, docked: false, z: moduleZIndex.current } : item);
      }
      const offset = current.length % 5;
      return [...current, { id: tab, x: 18 + offset * 24, y: 18 + offset * 24, z: moduleZIndex.current, minimized: false, maximized: current.length === 0, docked: false }];
    });
    setMobileSidebarOpen(false);
  };

  const focusModuleWindow = (id: TabType) => {
    moduleZIndex.current += 1;
    setActiveTab(id);
    setModuleWindows((current) => current.map((item) => item.id === id ? { ...item, z: moduleZIndex.current } : item));
  };

  const startModuleDrag = (event: React.PointerEvent, item: { id: TabType; x: number; y: number; maximized: boolean }) => {
    if (item.maximized || (event.target as HTMLElement).closest('button')) return;
    const bounds = moduleDesktopRef.current?.getBoundingClientRect();
    focusModuleWindow(item.id);
    dragModule.current = { id: item.id, offsetX: event.clientX - (bounds?.left || 0) - item.x, offsetY: event.clientY - (bounds?.top || 0) - item.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveModuleWindow = (event: React.PointerEvent) => {
    if (!dragModule.current || !moduleDesktopRef.current) return;
    const bounds = moduleDesktopRef.current.getBoundingClientRect();
    const { id, offsetX, offsetY } = dragModule.current;
    const x = Math.min(Math.max(8, bounds.width - 330), Math.max(0, event.clientX - bounds.left - offsetX));
    const y = Math.min(Math.max(8, bounds.height - 56), Math.max(0, event.clientY - bounds.top - offsetY));
    setModuleWindows((current) => current.map((item) => item.id === id ? { ...item, x, y, docked: false } : item));
  };

  const toggleModuleMinimize = (id: TabType) => {
    const bounds = moduleDesktopRef.current?.getBoundingClientRect();
    setModuleWindows((current) => {
      const target = current.find((item) => item.id === id);
      if (!target) return current;
      if (target.minimized) {
        return current.map((item) => item.id === id ? { ...item, minimized: false, docked: false } : item);
      }
      if (!target.maximized) {
        return current.map((item) => item.id === id ? { ...item, minimized: true, docked: false } : item);
      }

      const dockedCount = current.filter((item) => item.docked && item.minimized && item.id !== id).length;
      const availableWidth = bounds?.width || 1000;
      const columns = Math.max(1, Math.floor((availableWidth - 16) / 312));
      const column = dockedCount % columns;
      const row = Math.floor(dockedCount / columns);
      const x = 8 + column * 312;
      const y = Math.max(8, (bounds?.height || 700) - 56 - row * 56);
      return current.map((item) => item.id === id ? { ...item, x, y, minimized: true, maximized: false, docked: true } : item);
    });
  };

  const renderModuleWindow = (id: TabType, title: string, content: React.ReactNode) => {
    const item = moduleWindows.find((windowItem) => windowItem.id === id);
    if (!item) return null;
    return (
      <section key={id} className={`admin-module-window ${item.minimized ? 'is-minimized' : ''} ${item.maximized ? 'is-maximized' : ''}`} style={item.maximized ? { zIndex: item.z } : { left: item.x, top: item.y, zIndex: item.z }} onPointerDown={() => focusModuleWindow(id)}>
        <div className="admin-module-titlebar" onPointerDown={(event) => startModuleDrag(event, item)} onPointerMove={moveModuleWindow} onPointerUp={() => { dragModule.current = null; }} onPointerCancel={() => { dragModule.current = null; }}>
          <div><GripHorizontal className="h-4 w-4" /><strong>{title}</strong></div>
          <div className="admin-window-controls">
            <button type="button" onClick={() => toggleModuleMinimize(id)} aria-label="Minimize module"><Minus className="h-4 w-4" /></button>
            <button type="button" onClick={() => setModuleWindows((current) => current.map((windowItem) => windowItem.id === id ? {...windowItem, maximized: !windowItem.maximized, minimized: false, docked: false} : windowItem))} aria-label="Maximize module"><Maximize2 className="h-3.5 w-3.5" /></button>
            <button type="button" className="is-close" onClick={() => setModuleWindows((current) => current.filter((windowItem) => windowItem.id !== id))} aria-label="Close module"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="admin-module-content">{content}</div>
      </section>
    );
  };

  return (
    <div className={`admin-workspace ${darkMode ? 'admin-dark' : ''} fixed inset-0 z-50 flex flex-col overflow-hidden animate-in fade-in`}>
      {/* Admin Top Navigation Bar */}
      <header className="admin-topbar shrink-0">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <button type="button" className="admin-mobile-menu" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="admin-brand-mark">
            <Image src="/brand/pirates-logo.png" alt="Pirates of the Caribbean Zipline" width={46} height={46} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-slate-900 sm:text-base">Operations Center</span>
              <span className="admin-role-badge hidden sm:inline-flex">{currentRole}</span>
            </div>
            <div className="truncate text-[11px] text-slate-500">Pirates of the Caribbean Zipline · Roatán</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="admin-language-switch" aria-label="Panel language">
            <button type="button" onClick={() => onLanguageChange('en')} className={lang === 'en' ? 'is-active' : ''}>EN</button>
            <button type="button" onClick={() => onLanguageChange('es')} className={lang === 'es' ? 'is-active' : ''}>ES</button>
          </div>
          {notification && (
            <div className="admin-notification hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs md:flex animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}
          <button
            type="button"
            id="close-admin-panel-btn"
            onClick={onClose}
            className="admin-signout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {mobileSidebarOpen && <button type="button" className="admin-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation" />}
        {/* Sidebar Tabs */}
        <aside className={`admin-sidebar ${sidebarExpanded ? 'is-expanded' : 'is-collapsed'} ${mobileSidebarOpen ? 'is-mobile-open' : ''}`}>
          <div className="admin-sidebar-heading">
            <div className="flex min-w-0 items-center gap-3">
              <span className="admin-portal-symbol"><Shield className="h-4 w-4" /></span>
              {sidebarExpanded && <div className="hidden min-w-0 sm:block"><p className="truncate text-xs font-bold text-slate-800">Admin Portal</p><p className="text-[10px] text-slate-500">Management</p></div>}
              <div className="sm:hidden"><p className="text-xs font-bold text-slate-800">Admin Portal</p><p className="text-[10px] text-slate-500">Management</p></div>
            </div>
            <button type="button" className="admin-drawer-close sm:hidden" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button>
          </div>
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {navigationItems.map(({ id, label, icon: Icon, count }) => (
              <button key={id} type="button" onClick={() => selectTab(id)} title={!sidebarExpanded ? label : undefined} className={`admin-nav-item ${activeTab === id ? 'is-active' : ''}`}>
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className={`admin-nav-label ${sidebarExpanded ? '' : 'sm:hidden'}`}>{label}</span>
                {!!count && <span className={`admin-nav-count ${sidebarExpanded ? '' : 'sm:hidden'}`}>{count}</span>}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <p className={sidebarExpanded ? '' : 'sm:hidden'}>Created by <strong>BWP</strong></p>
            <button type="button" className="admin-theme-toggle" onClick={toggleDarkMode} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'} title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className={sidebarExpanded ? '' : 'sm:hidden'}>{darkMode ? (lang === 'es' ? 'Modo claro' : 'Light mode') : (lang === 'es' ? 'Modo oscuro' : 'Dark mode')}</span>
            </button>
            <button type="button" className="admin-collapse-button hidden sm:flex" onClick={() => setSidebarExpanded((value) => !value)} aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
              {sidebarExpanded ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              {sidebarExpanded && <span>Collapse menu</span>}
            </button>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main ref={moduleDesktopRef} className="admin-module-desktop relative flex-1 bg-[#0a0f16] overflow-hidden">
          {moduleWindows.length === 0 && (
            <div className="admin-empty-workspace" aria-hidden="true">
              <Image src="/brand/pirates-logo.png" alt="" width={210} height={210} className="h-auto w-36 object-contain sm:w-48" />
              <p>Pirates of the Caribbean Zipline</p>
              <span>{lang === 'es' ? 'Selecciona un módulo para comenzar' : 'Select a module to get started'}</span>
            </div>
          )}
          {/* TAB 1: DASHBOARD METRICS */}
          {renderModuleWindow('dashboard', t.admin.tabs.dashboard, (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Resumen Operativo del Parque' : 'Park Operational Dashboard'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Monitoreo en tiempo real de reservaciones, pasajeros de crucero e ingresos.'
                      : 'Real-time monitoring of canopy bookings, cruise ship guests, and revenue.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => selectTab('reservations')}
                  className="btn-wine-red px-4 py-2 rounded-lg text-xs font-bold"
                >
                  {t.admin.tabs.reservations} ({reservations.length})
                </button>
              </div>

              {/* 8 Stats Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#111923] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-400 block font-medium">
                    {t.admin.stats.todayBookings}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-1 block">
                    {todayReservations.length}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {upcomingReservations.length} {lang === 'es' ? 'próximas' : 'upcoming'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-400 block font-medium">
                    {t.admin.stats.totalVisitors}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#ffd778] mt-1 block">
                    {totalVisitors}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {lang === 'es' ? 'Adultos y niños' : 'Adults & kids'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-amber-500/30 p-4 rounded-xl">
                  <span className="text-xs text-amber-400 block font-medium">
                    {t.admin.stats.pending}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1 block">
                    {pendingReservations.length}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {lang === 'es' ? 'Requieren confirmación' : 'Require confirmation'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-emerald-500/30 p-4 rounded-xl">
                  <span className="text-xs text-emerald-400 block font-medium">
                    {t.admin.stats.confirmed}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1 block">
                    {confirmedReservations.length}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {cancelledReservations.length} {lang === 'es' ? 'canceladas' : 'cancelled'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-[#c5a059]/40 p-4 rounded-xl">
                  <span className="text-xs text-[#d4af37] block font-medium">
                    {t.admin.stats.revenue}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-1 block">
                    ${totalEstimatedRevenue.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {lang === 'es' ? 'Total en libros' : 'Total on books'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-blue-500/30 p-4 rounded-xl">
                  <span className="text-xs text-blue-400 block font-medium">
                    {t.admin.stats.cruiseRatio}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-300 mt-1 block">
                    {reservations.length > 0
                      ? Math.round((cruiseReservationsCount / reservations.length) * 100)
                      : 0}
                    %
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {cruiseReservationsCount} {lang === 'es' ? 'cruceristas' : 'cruise passengers'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-400 block font-medium">
                    {t.admin.stats.transportReqs}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white mt-1 block">
                    {transportRequestsCount}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {lang === 'es' ? 'Traslados requeridos' : 'Pickups needed'}
                  </span>
                </div>

                <div className="bg-[#111923] border border-gray-800 p-4 rounded-xl">
                  <span className="text-xs text-gray-400 block font-medium">
                    {t.admin.stats.popularTour}
                  </span>
                  <span className="text-sm font-bold text-[#ffd778] mt-2 block line-clamp-2">
                    {tours[0]?.name[lang] || 'Circuito Extremo'}
                  </span>
                </div>
              </div>

              {/* Recent Pending Bookings Table Preview */}
              <div className="bg-[#111923] border border-gray-800 rounded-xl p-5">
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {lang === 'es'
                      ? 'Reservaciones Recientes Pendientes de Aprobación'
                      : 'Recent Pending Reservations'}
                  </span>
                </h3>

                {pendingReservations.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    {lang === 'es'
                      ? 'No hay solicitudes pendientes en este momento.'
                      : 'No pending reservation requests right now.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingReservations.slice(0, 5).map((res) => (
                      <div
                        key={res.id}
                        className="bg-[#15202d] p-3 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white block">
                            {res.customerName} ({res.code})
                          </span>
                          <span className="text-gray-400">
                            {res.date} • {res.timeSlot} • {res.adults} adultos • {res.tourName}
                          </span>
                          {res.isCruisePassenger && (
                            <span className="text-blue-300 block">
                              Crucero: {res.shipName} ({res.arrivalPort})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateReservationStatus(res.id, 'Confirmado')}
                            className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            {lang === 'es' ? 'Aprobar y Confirmar' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateReservationStatus(res.id, 'Contactado')}
                            className="px-3 py-1.5 rounded bg-[#1f2e42] hover:bg-[#273952] text-gray-200 text-[11px]"
                          >
                            {lang === 'es' ? 'Marcar Contactado' : 'Contacted'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* TAB 2: RESERVATION MANAGEMENT (FULL CRUD & ALL 8 STATES) */}
          {renderModuleWindow('reservations', t.admin.tabs.reservations, (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Gestión de Reservaciones' : 'Reservation Management'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Búsqueda, cambio de estados, registro de pagos, notas internas y contacto vía WhatsApp.'
                      : 'Search, update statuses, record payments, internal notes and WhatsApp messaging.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-2 rounded-lg bg-[#15202d] hover:bg-[#1d2d40] border border-[#c5a059]/40 text-xs font-bold text-gray-200 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ffd778]" />
                    <span>{t.admin.actions.exportCsv}</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#111923] p-4 rounded-xl border border-gray-800">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.admin.actions.searchPlaceholder}
                    className="w-full bg-[#182332] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#182332] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">{t.admin.actions.allStatuses}</option>
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="bg-[#111923] border border-gray-800 rounded-xl overflow-x-auto shadow">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#15202d] text-gray-400 uppercase font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Código</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Fecha / Hora</th>
                      <th className="p-3">Personas</th>
                      <th className="p-3">Tour</th>
                      <th className="p-3">Crucero / Hotel</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Total</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredReservations.map((res) => {
                      const whatsappLink = `https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hola ${res.customerName}, le saludamos de Pirates of the Caribbean Zipline en Roatán referente a su reserva ${res.code}.`
                      )}`;

                      return (
                        <tr key={res.id} onDoubleClick={() => openReservationWindow(res)} className="hover:bg-[#15212f] transition-colors cursor-default" title={lang === 'es' ? 'Doble clic para abrir' : 'Double-click to open'}>
                          <td className="p-3 font-mono font-bold text-[#ffd778]">
                            {res.code}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{res.customerName}</div>
                            <div className="text-[11px] text-gray-400">{res.phone}</div>
                          </td>
                          <td className="p-3">
                            <div>{res.date}</div>
                            <div className="text-[11px] text-gray-400">{res.timeSlot}</div>
                          </td>
                          <td className="p-3">
                            <span>{res.adults} ad.</span>
                            {res.children > 0 && <span className="ml-1 text-gray-400">+{res.children} niñ.</span>}
                          </td>
                          <td className="p-3 max-w-xs truncate">
                            {res.tourName}
                          </td>
                          <td className="p-3">
                            {res.isCruisePassenger ? (
                              <span className="text-blue-300 flex items-center gap-1">
                                <Ship className="w-3 h-3" />
                                <span>{res.shipName || 'Crucero'}</span>
                              </span>
                            ) : (
                              <span>{res.lodgingType}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={res.status}
                              onChange={(e) => onUpdateReservationStatus(res.id, e.target.value as ReservationStatus)}
                              className={`text-[11px] font-bold rounded px-2 py-1 border border-gray-700 bg-[#0d141e] cursor-pointer ${
                                res.status === 'Confirmado' || res.status === 'Pagado'
                                  ? 'text-emerald-400'
                                  : res.status === 'Pendiente'
                                  ? 'text-amber-400'
                                  : res.status === 'Cancelado'
                                  ? 'text-rose-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              {statusOptions.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3 font-bold text-white">
                            ${res.totalAmount}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openReservationWindow(res)}
                                title={lang === 'es' ? 'Ver reservación completa' : 'View full reservation'}
                                className="admin-table-view"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                title="Contactar por WhatsApp"
                                className="p-1.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => setEditingReservation(res)}
                                title="Editar detalles y notas"
                                className="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => { setReservationToDelete(res); setDeleteCredentials({ username: '', password: '' }); setDeleteAuthError(false); }}
                                title="Eliminar"
                                className="p-1.5 rounded bg-rose-950 text-rose-300 hover:bg-rose-900"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredReservations.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-xs">
                    {lang === 'es' ? 'No se encontraron reservaciones.' : 'No reservations found.'}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* TAB 3: PRICING MANAGEMENT */}
          {renderModuleWindow('pricing', t.admin.tabs.pricing, (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Administración de Precios y Tarifas' : 'Pricing Administration'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Modifica tarifas para adultos, niños, cruceristas y paquetes especiales.'
                      : 'Modify rates for adults, children, cruise passengers, and special packages.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSavePrices}
                  className="btn-wine-red px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.admin.actions.saveChanges}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tempPrices.map((tier, idx) => (
                  <div key={tier.id} className="bg-[#111923] border border-gray-800 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold text-[#ffd778]">
                        {tier.title[lang]}
                      </h3>
                      <span className="text-xs text-gray-400 uppercase font-mono">{tier.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 font-semibold">
                          {lang === 'es' ? 'Precio (USD)' : 'Price (USD)'}
                        </label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const updated = [...tempPrices];
                            updated[idx].price = Number(e.target.value);
                            setTempPrices(updated);
                          }}
                          className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-sm text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1 font-semibold">
                          {lang === 'es' ? 'Rango de Edad' : 'Age Range'}
                        </label>
                        <input
                          type="text"
                          value={tier.ageRange[lang]}
                          onChange={(e) => {
                            const updated = [...tempPrices];
                            updated[idx].ageRange[lang] = e.target.value;
                            setTempPrices(updated);
                          }}
                          className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">
                        {lang === 'es' ? 'Condiciones' : 'Terms & Conditions'}
                      </label>
                      <input
                        type="text"
                        value={tier.conditions[lang]}
                        onChange={(e) => {
                          const updated = [...tempPrices];
                          updated[idx].conditions[lang] = e.target.value;
                          setTempPrices(updated);
                        }}
                        className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* TAB 4: EXPERIENCES / TOURS MANAGEMENT */}
          {renderModuleWindow('experiences', t.admin.tabs.experiences, (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Administración de Experiencias y Recorridos' : 'Tours & Circuits Administration'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Edita nombres, estadísticas reales del canopy (cables, plataformas, altura), fotos y descripciones.'
                      : 'Edit names, real course metrics (ziplines, platforms, height), photos, and descriptions.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveTours}
                  className="btn-wine-red px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.admin.actions.saveChanges}</span>
                </button>
              </div>

              <div className="space-y-6">
                {tempTours.map((tour, idx) => (
                  <div key={tour.id} className="bg-[#111923] border border-gray-800 p-6 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 font-semibold">
                          {lang === 'es' ? 'Nombre del Recorrido' : 'Tour Title'}
                        </label>
                        <input
                          type="text"
                          value={tour.name[lang]}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].name[lang] = e.target.value;
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-sm text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1 font-semibold">
                          {lang === 'es' ? 'Subtítulo' : 'Subtitle'}
                        </label>
                        <input
                          type="text"
                          value={tour.subtitle[lang]}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].subtitle[lang] = e.target.value;
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d141e] p-4 rounded-xl">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Cables / Tirolesas</label>
                        <input
                          type="number"
                          value={tour.stats.ziplines}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].stats.ziplines = Number(e.target.value);
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#15202d] border border-gray-700 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Plataformas</label>
                        <input
                          type="number"
                          value={tour.stats.platforms}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].stats.platforms = Number(e.target.value);
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#15202d] border border-gray-700 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Altura Máxima</label>
                        <input
                          type="text"
                          value={tour.stats.maxHeight}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].stats.maxHeight = e.target.value;
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#15202d] border border-gray-700 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Duración</label>
                        <input
                          type="text"
                          value={tour.stats.duration}
                          onChange={(e) => {
                            const updated = [...tempTours];
                            updated[idx].stats.duration = e.target.value;
                            setTempTours(updated);
                          }}
                          className="w-full bg-[#15202d] border border-gray-700 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">
                        {lang === 'es' ? 'Descripción del Circuito' : 'Tour Description'}
                      </label>
                      <textarea
                        rows={3}
                        value={tour.description[lang]}
                        onChange={(e) => {
                          const updated = [...tempTours];
                          updated[idx].description[lang] = e.target.value;
                          setTempTours(updated);
                        }}
                        className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* TAB 5: GALLERY MANAGEMENT */}
          {renderModuleWindow('gallery', t.admin.tabs.gallery, (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Administración de Galería' : 'Gallery Management'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Agrega imágenes y videos, cambia categorías, define destacados y elimina elementos.'
                      : 'Add images and videos, change categories, set featured and remove items.'}
                  </p>
                </div>

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime" multiple onChange={handlePhotoUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="admin-primary-action px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? (lang === 'es' ? 'Procesando…' : 'Processing…') : (lang === 'es' ? 'Subir desde dispositivo' : 'Upload from device')}</span>
                </button>
              </div>

              <div className="rounded-2xl border border-dashed border-[#d8bb78]/25 bg-[#d8bb78]/5 p-5 text-sm text-slate-400">
                <strong className="text-slate-200">{lang === 'es' ? 'Carga directa desde PC o celular.' : 'Direct upload from desktop or mobile.'}</strong>{' '}
                {lang === 'es' ? 'Puedes seleccionar una o varias fotografías o videos. Cada archivo queda registrado en la base de datos.' : 'Select one or multiple photos or videos. Every file is registered in the database.'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {gallery.map((item, idx) => (
                  <div key={item.id} className="bg-[#111923] border border-gray-800 rounded-xl overflow-hidden p-3 space-y-2">
                    <div className="relative h-52 rounded-lg overflow-hidden bg-black">
                      <Image
                        src={item.imageUrl}
                        alt={item.title[lang]}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {item.type === 'video' && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">
                          Video
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      value={item.title[lang]}
                      onChange={(e) => {
                        const updated = [...gallery];
                        updated[idx].title[lang] = e.target.value;
                        onUpdateGallery(updated);
                      }}
                      className="w-full bg-[#182332] border border-gray-700 rounded px-2 py-1 text-xs text-white"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx].category = e.target.value as any;
                          onUpdateGallery(updated);
                        }}
                        className="bg-[#15202d] border border-gray-700 text-[11px] rounded px-2 py-1 text-gray-300"
                      >
                        <option value="tirolesas">Tirolesas</option>
                        <option value="plataformas">Plataformas</option>
                        <option value="visitantes">Visitantes</option>
                        <option value="paisajes">Paisajes</option>
                        <option value="guias">Guías</option>
                        <option value="instalaciones">Instalaciones</option>
                        <option value="videos">Videos</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = gallery.filter((g) => g.id !== item.id);
                          onUpdateGallery(updated);
                          showNotification(lang === 'es' ? 'Elemento eliminado' : 'Item removed');
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* TAB 6: SITE & CONTACT SETTINGS */}
          {renderModuleWindow('site', t.admin.tabs.site, (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Administración del Sitio y Contacto' : 'Site Configuration & Contact'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Modifica textos del encabezado, hero, teléfonos oficiales, WhatsApp, horarios y avisos de cruceros.'
                      : 'Edit header text, hero copy, official phone, WhatsApp, opening hours and cruise notifications.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSiteConfig}
                  className="btn-wine-red px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.admin.actions.saveChanges}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Texts */}
                <div className="bg-[#111923] border border-gray-800 p-5 rounded-xl space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#ffd778]">
                    {lang === 'es' ? 'Textos Principales del Hero' : 'Hero Section Copy'}
                  </h3>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Título Principal</label>
                    <input
                      type="text"
                      value={tempSiteConfig.heroTitle[lang]}
                      onChange={(e) =>
                        setTempSiteConfig({
                          ...tempSiteConfig,
                          heroTitle: { ...tempSiteConfig.heroTitle, [lang]: e.target.value }
                        })
                      }
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Subtítulo</label>
                    <textarea
                      rows={3}
                      value={tempSiteConfig.heroSubtitle[lang]}
                      onChange={(e) =>
                        setTempSiteConfig({
                          ...tempSiteConfig,
                          heroSubtitle: { ...tempSiteConfig.heroSubtitle, [lang]: e.target.value }
                        })
                      }
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Slogan / Frase Secundaria</label>
                    <input
                      type="text"
                      value={tempSiteConfig.heroSecondary[lang]}
                      onChange={(e) =>
                        setTempSiteConfig({
                          ...tempSiteConfig,
                          heroSecondary: { ...tempSiteConfig.heroSecondary, [lang]: e.target.value }
                        })
                      }
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Contact & Hours */}
                <div className="bg-[#111923] border border-gray-800 p-5 rounded-xl space-y-4">
                  <h3 className="font-heading text-base font-bold text-[#ffd778]">
                    {lang === 'es' ? 'Contacto Oficial y Horarios' : 'Official Contact & Schedules'}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Teléfono</label>
                      <input
                        type="text"
                        value={tempSiteConfig.phone}
                        onChange={(e) => setTempSiteConfig({ ...tempSiteConfig, phone: e.target.value })}
                        className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">WhatsApp</label>
                      <input
                        type="text"
                        value={tempSiteConfig.whatsapp}
                        onChange={(e) => setTempSiteConfig({ ...tempSiteConfig, whatsapp: e.target.value })}
                        className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      value={tempSiteConfig.email}
                      onChange={(e) => setTempSiteConfig({ ...tempSiteConfig, email: e.target.value })}
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Horarios de Atención</label>
                    <input
                      type="text"
                      value={tempSiteConfig.openingHours[lang]}
                      onChange={(e) =>
                        setTempSiteConfig({
                          ...tempSiteConfig,
                          openingHours: { ...tempSiteConfig.openingHours, [lang]: e.target.value }
                        })
                      }
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Garantía / Nota de Cruceros</label>
                    <input
                      type="text"
                      value={tempSiteConfig.cruisePortNotes[lang]}
                      onChange={(e) =>
                        setTempSiteConfig({
                          ...tempSiteConfig,
                          cruisePortNotes: { ...tempSiteConfig.cruisePortNotes, [lang]: e.target.value }
                        })
                      }
                      className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* TAB 7: REVIEWS & TESTIMONIALS */}
          {renderModuleWindow('reviews', t.admin.tabs.reviews, (
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h2 className="font-heading text-2xl font-bold text-white">
                  {lang === 'es' ? 'Moderación de Opiniones de Clientes' : 'Review Moderation'}
                </h2>
                <p className="text-xs text-gray-400">
                  {lang === 'es'
                    ? 'Revisa comentarios reales enviados desde la web y decide cuáles publicar.'
                    : 'Review real comments submitted on the website and choose which ones to publish.'}
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={rev.id} className="bg-[#111923] border border-gray-800 p-4 rounded-xl flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">{rev.countryCode && <img src={`https://flagcdn.com/24x18/${rev.countryCode.toLowerCase()}.png`} alt="" width="24" height="18" className="rounded-[2px]" />}({rev.country || rev.location})</span>
                        <span className="text-xs text-[#ffd778]">{'★'.repeat(rev.rating)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${rev.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{rev.isActive ? (lang === 'es' ? 'PUBLICADO' : 'PUBLISHED') : (lang === 'es' ? 'PENDIENTE' : 'PENDING')}</span>
                      </div>
                      <p className="text-xs text-gray-300 italic max-w-2xl">
                        &ldquo;{rev.comment[lang]}&rdquo;
                      </p>
                      {rev.email && <p className="text-[11px] text-slate-500">{lang === 'es' ? 'Correo privado' : 'Private email'}: {rev.email}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...reviews];
                          updated[idx] = { ...updated[idx], isActive: !updated[idx].isActive, isVerified: !updated[idx].isActive || updated[idx].isVerified };
                          onUpdateReviews(updated);
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          rev.isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {rev.isActive ? (lang === 'es' ? 'Ocultar' : 'Hide') : (lang === 'es' ? 'Aprobar' : 'Approve')}
                      </button>
                      <button type="button" onClick={() => onUpdateReviews(reviews.filter((item) => item.id !== rev.id))} className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10" aria-label={lang === 'es' ? 'Eliminar comentario' : 'Delete review'}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* TAB 8: USERS & ROLES */}
          {renderModuleWindow('roles', t.admin.tabs.roles, (
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h2 className="font-heading text-2xl font-bold text-white">
                  {lang === 'es' ? 'Usuarios y Roles de Administración' : 'User Roles & Permissions'}
                </h2>
                <p className="text-xs text-gray-400">
                  {lang === 'es'
                    ? 'Crea accesos individuales para tu equipo y controla quién puede entrar.'
                    : 'Create individual staff accounts and control who can sign in.'}
                </p>
              </div>

              <section className="admin-profile-card">
                <span className="admin-profile-avatar"><UserRound className="h-6 w-6" /></span>
                <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">{lang === 'es' ? 'Perfil conectado' : 'Signed-in profile'}</p><h3 className="mt-1 truncate text-base font-bold text-slate-900">{currentUser.name}</h3><p className="text-xs text-slate-500">@{currentUser.username}</p></div>
                <div className="admin-permission-badge"><Shield className="h-3.5 w-3.5" /><span>{currentRole === 'Administrador general' ? (lang === 'es' ? 'Administrador' : 'Administrator') : (lang === 'es' ? 'Lector' : 'Reader')}</span></div>
                <p className="w-full border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600 sm:w-auto sm:max-w-sm sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">{currentRole === 'Administrador general' ? (lang === 'es' ? 'Acceso completo, incluida la administración e invitación de empleados.' : 'Full access, including employee invitations and account management.') : (lang === 'es' ? 'Acceso operativo completo. No puede invitar ni administrar cuentas de empleados.' : 'Full operational access. Cannot invite or manage employee accounts.')}</p>
              </section>

              {currentRole === 'Administrador general' ? <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
                <form onSubmit={handleCreateUser} className="admin-card space-y-4 rounded-2xl p-6">
                  <div className="flex items-center gap-3"><span className="admin-icon"><UserPlus className="h-5 w-5" /></span><div><h3 className="font-semibold text-white">{lang === 'es' ? 'Invitar usuario' : 'Invite user'}</h3><p className="text-xs text-slate-500">{lang === 'es' ? 'Crea sus credenciales de acceso.' : 'Create their sign-in credentials.'}</p></div></div>
                  <input value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} placeholder={lang === 'es' ? 'Nombre completo' : 'Full name'} className="admin-input" required />
                  <input value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} placeholder={lang === 'es' ? 'Nombre de usuario' : 'Username'} className="admin-input" autoComplete="off" required />
                  <div className="relative"><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" /><input type="password" minLength={8} value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} placeholder={lang === 'es' ? 'Contraseña (mínimo 8 caracteres)' : 'Password (8 characters minimum)'} className="admin-input pl-10" autoComplete="new-password" required /></div>
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as AdminRole})} className="admin-input">
                    <option value="Solo lectura">{lang === 'es' ? 'Lector — acceso operativo' : 'Reader — operational access'}</option>
                    <option value="Administrador general">{lang === 'es' ? 'Administrador — acceso completo' : 'Administrator — full access'}</option>
                  </select>
                  <button type="submit" className="admin-primary-action w-full rounded-xl py-3 text-sm font-bold">{lang === 'es' ? 'Crear acceso' : 'Create account'}</button>
                </form>

                <div className="space-y-3">
                  {users.map((user) => <article key={user.id} className="admin-card flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
                    <span className="admin-icon"><UserRound className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-white">{user.name}</strong>{user.id === currentUser.id && <span className="admin-current-badge">{lang === 'es' ? 'SESIÓN ACTUAL' : 'CURRENT'}</span>}</div><p className="mt-1 text-xs text-slate-500">@{user.username}</p><div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700"><Shield className="h-3.5 w-3.5 text-slate-500" />{user.role === 'Administrador general' ? (lang === 'es' ? 'Administrador · control total' : 'Administrator · full control') : (lang === 'es' ? 'Lector · sin gestión de usuarios' : 'Reader · no user management')}</div></div>
                    <button type="button" disabled={user.isRoot || user.id === currentUser.id} onClick={() => onUpdateUsers(users.map(item => item.id === user.id ? {...item, isActive: !item.isActive} : item))} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${user.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{user.isActive ? (lang === 'es' ? 'Activo' : 'Active') : (lang === 'es' ? 'Desactivado' : 'Disabled')}</button>
                    <button type="button" disabled={user.isRoot || user.id === currentUser.id} onClick={() => onUpdateUsers(users.filter(item => item.id !== user.id))} className="rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                  </article>)}
                </div>
              </div> : <div className="admin-card rounded-2xl p-8 text-center"><Shield className="mx-auto h-8 w-8 text-slate-500" /><h3 className="mt-3 font-semibold text-white">{lang === 'es' ? 'Administración de usuarios protegida' : 'User management protected'}</h3><p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{lang === 'es' ? 'Tu perfil puede trabajar en todos los módulos operativos. Solo un administrador puede invitar, activar, desactivar o eliminar empleados.' : 'Your profile can work in every operational module. Only an administrator can invite, activate, disable, or remove employees.'}</p></div>}
            </div>
          ))}

          {activeTab === 'reservations' && moduleWindows.some((item) => item.id === 'reservations' && !item.minimized) && reservationWindows.map((windowState) => {
            const reservation = reservations.find((item) => item.id === windowState.id);
            if (!reservation) return null;
            const whatsappLink = `https://wa.me/${reservation.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${reservation.customerName}, le saludamos de Pirates of the Caribbean Zipline en Roatán referente a su reserva ${reservation.code}.`)}`;
            const balance = Math.max(0, reservation.totalAmount - reservation.paidAmount);
            return (
              <section
                key={windowState.id}
                className={`admin-reservation-view ${windowState.minimized ? 'is-minimized' : ''} ${windowState.maximized ? 'is-maximized' : ''}`}
                style={windowState.maximized ? { zIndex: windowState.z } : { left: windowState.x, top: windowState.y, zIndex: windowState.z }}
                onPointerDown={() => focusReservationWindow(windowState.id)}
              >
                <div className="admin-window-titlebar" onPointerDown={(event) => startWindowDrag(event, windowState)} onPointerMove={moveReservationWindow} onPointerUp={() => { dragWindow.current = null; }} onPointerCancel={() => { dragWindow.current = null; }}>
                  <div><GripHorizontal className="h-4 w-4" /><span>{reservation.code}</span><small>{reservation.customerName}</small></div>
                  <div className="admin-window-controls">
                    <button type="button" onClick={() => setReservationWindows((current) => current.map((item) => item.id === windowState.id ? {...item, minimized: !item.minimized} : item))} aria-label="Minimize"><Minus className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setReservationWindows((current) => current.map((item) => item.id === windowState.id ? {...item, maximized: !item.maximized, minimized: false} : item))} aria-label="Maximize"><Maximize2 className="h-3.5 w-3.5" /></button>
                    <button type="button" className="is-close" onClick={() => setReservationWindows((current) => current.filter((item) => item.id !== windowState.id))} aria-label="Close"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="admin-reservation-view-inner">
                  <div className="admin-record-toolbar">
                    <span className="admin-window-hint">{lang === 'es' ? 'Puedes mover esta ventana arrastrando la barra superior.' : 'Drag the top bar to move this window.'}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => window.print()} className="admin-record-action"><Printer className="h-4 w-4" />{lang === 'es' ? 'Imprimir' : 'Print'}</button>
                      <button type="button" onClick={() => setEditingReservation(reservation)} className="admin-record-action"><Edit2 className="h-4 w-4" />{lang === 'es' ? 'Editar' : 'Edit'}</button>
                    </div>
                  </div>

                  <header className="admin-record-header">
                    <div><p className="admin-record-eyebrow">{lang === 'es' ? 'Expediente de reservación' : 'Reservation record'}</p><h2>{reservation.code}</h2><p>{lang === 'es' ? 'Creada' : 'Created'}: {new Date(reservation.createdAt).toLocaleString(lang === 'es' ? 'es-HN' : 'en-US')}</p></div>
                    <select value={reservation.status} onChange={(e) => onUpdateReservationStatus(reservation.id, e.target.value as ReservationStatus)} className="admin-record-status">
                      {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </header>

                  <div className="admin-record-summary">
                    <div><span>{lang === 'es' ? 'Total' : 'Total'}</span><strong>${reservation.totalAmount.toFixed(2)}</strong></div>
                    <div><span>{lang === 'es' ? 'Pagado' : 'Paid'}</span><strong>${reservation.paidAmount.toFixed(2)}</strong></div>
                    <div><span>{lang === 'es' ? 'Saldo pendiente' : 'Balance due'}</span><strong>${balance.toFixed(2)}</strong></div>
                    <div><span>{lang === 'es' ? 'Visitantes' : 'Guests'}</span><strong>{reservation.adults + reservation.children}</strong></div>
                  </div>

                  <div className="admin-record-grid">
                    <article className="admin-record-card">
                      <h3><UserRound className="h-4 w-4" />{lang === 'es' ? 'Cliente' : 'Customer'}</h3>
                      <dl><div><dt>{lang === 'es' ? 'Nombre' : 'Name'}</dt><dd>{reservation.customerName}</dd></div><div><dt>{lang === 'es' ? 'Teléfono' : 'Phone'}</dt><dd><a href={`tel:${reservation.phone}`}>{reservation.phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${reservation.email}`}>{reservation.email}</a></dd></div></dl>
                      <div className="admin-record-contact"><a href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a><a href={`mailto:${reservation.email}`}><Mail className="h-4 w-4" />Email</a></div>
                    </article>
                    <article className="admin-record-card">
                      <h3><Calendar className="h-4 w-4" />{lang === 'es' ? 'Experiencia' : 'Experience'}</h3>
                      <dl><div><dt>Tour</dt><dd>{reservation.tourName}</dd></div><div><dt>{lang === 'es' ? 'Fecha' : 'Date'}</dt><dd>{reservation.date}</dd></div><div><dt>{lang === 'es' ? 'Hora' : 'Time'}</dt><dd>{reservation.timeSlot}</dd></div><div><dt>{lang === 'es' ? 'Personas' : 'Guests'}</dt><dd>{reservation.adults} {lang === 'es' ? 'adultos' : 'adults'} · {reservation.children} {lang === 'es' ? 'niños' : 'children'}</dd></div></dl>
                    </article>
                    <article className="admin-record-card">
                      <h3><MapPin className="h-4 w-4" />{lang === 'es' ? 'Llegada y transporte' : 'Arrival & transport'}</h3>
                      <dl><div><dt>{lang === 'es' ? 'Hospedaje' : 'Lodging'}</dt><dd>{reservation.lodgingType}</dd></div><div><dt>{lang === 'es' ? 'Hotel o dirección' : 'Hotel or address'}</dt><dd>{reservation.hotelOrAddress || '—'}</dd></div><div><dt>{lang === 'es' ? 'Transporte' : 'Transportation'}</dt><dd>{reservation.needsTransport ? (lang === 'es' ? 'Solicitado' : 'Requested') : (lang === 'es' ? 'No solicitado' : 'Not requested')}</dd></div>{reservation.needsTransport && <div><dt>Pickup</dt><dd>{reservation.transportPickupLocation || '—'}</dd></div>}</dl>
                    </article>
                    <article className="admin-record-card">
                      <h3><Ship className="h-4 w-4" />{lang === 'es' ? 'Información de crucero' : 'Cruise information'}</h3>
                      {reservation.isCruisePassenger ? <dl><div><dt>{lang === 'es' ? 'Barco' : 'Ship'}</dt><dd>{reservation.shipName || '—'}</dd></div><div><dt>{lang === 'es' ? 'Puerto' : 'Port'}</dt><dd>{reservation.arrivalPort || '—'}</dd></div><div><dt>{lang === 'es' ? 'Llegada' : 'Arrival'}</dt><dd>{reservation.shipArrivalTime || '—'}</dd></div><div><dt>{lang === 'es' ? 'Salida' : 'Departure'}</dt><dd>{reservation.shipDepartureTime || '—'}</dd></div></dl> : <p className="admin-record-empty">{lang === 'es' ? 'Esta reservación no corresponde a un pasajero de crucero.' : 'This reservation is not for a cruise passenger.'}</p>}
                    </article>
                  </div>

                  <div className="admin-record-notes"><div><h3>{lang === 'es' ? 'Solicitudes especiales' : 'Special requests'}</h3><p>{reservation.specialRequests || (lang === 'es' ? 'Sin solicitudes especiales.' : 'No special requests.')}</p></div><div><h3>{lang === 'es' ? 'Notas internas' : 'Internal notes'}</h3><p>{reservation.internalNotes || (lang === 'es' ? 'Sin notas internas.' : 'No internal notes.')}</p></div></div>
                  <div className="admin-record-danger"><button type="button" onClick={() => { setReservationToDelete(reservation); setDeleteCredentials({ username: '', password: '' }); setDeleteAuthError(false); }}><Trash2 className="h-4 w-4" />{lang === 'es' ? 'Eliminar reservación' : 'Delete reservation'}</button></div>
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {reservationToDelete && (
        <div className="admin-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-reservation-title">
          <form onSubmit={handleConfirmedReservationDelete} className="admin-confirm-card">
            <div className="admin-confirm-icon"><Trash2 className="h-5 w-5" /></div>
            <h3 id="delete-reservation-title" className="text-lg font-bold text-slate-900">{lang === 'es' ? 'Confirmar eliminación' : 'Confirm deletion'}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{lang === 'es' ? `Para eliminar la reservación ${reservationToDelete.code}, confirma las credenciales de tu cuenta.` : `To delete reservation ${reservationToDelete.code}, confirm your account credentials.`}</p>
            <div className="mt-5 space-y-3">
              <input value={deleteCredentials.username} onChange={(e) => { setDeleteCredentials({...deleteCredentials, username: e.target.value}); setDeleteAuthError(false); }} className="admin-input" placeholder={lang === 'es' ? 'Usuario' : 'Username'} autoComplete="username" required />
              <input type="password" value={deleteCredentials.password} onChange={(e) => { setDeleteCredentials({...deleteCredentials, password: e.target.value}); setDeleteAuthError(false); }} className="admin-input" placeholder={lang === 'es' ? 'Contraseña' : 'Password'} autoComplete="current-password" required />
              {deleteAuthError && <p className="admin-confirm-error">{lang === 'es' ? 'El usuario o la contraseña no coinciden con la sesión actual.' : 'The username or password does not match the current session.'}</p>}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeDeleteConfirmation} className="admin-confirm-cancel">{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
              <button type="submit" className="admin-confirm-delete">{lang === 'es' ? 'Eliminar reservación' : 'Delete reservation'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Internal Notes & Reservation Editor Modal */}
      {editingReservation && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f1722] border border-[#c5a059] rounded-2xl p-6 max-w-lg w-full text-gray-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="font-heading text-lg font-bold text-white">
                {lang === 'es' ? 'Detalles de Reserva:' : 'Booking Details:'} {editingReservation.code}
              </h3>
              <button
                type="button"
                onClick={() => setEditingReservation(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  value={editingReservation.customerName}
                  onChange={(e) => setEditingReservation({ ...editingReservation, customerName: e.target.value })}
                  className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Monto Total (USD)</label>
                  <input
                    type="number"
                    value={editingReservation.totalAmount}
                    onChange={(e) => setEditingReservation({ ...editingReservation, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Monto Pagado (USD)</label>
                  <input
                    type="number"
                    value={editingReservation.paidAmount}
                    onChange={(e) => setEditingReservation({ ...editingReservation, paidAmount: Number(e.target.value) })}
                    className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Notas Internas (Chofer, Van, Solicitudes)</label>
                <textarea
                  rows={3}
                  value={editingReservation.internalNotes || ''}
                  onChange={(e) => setEditingReservation({ ...editingReservation, internalNotes: e.target.value })}
                  placeholder="Ej. Chofer asignado: Mario, van #4. Requiere regreso temprano."
                  className="w-full bg-[#182332] border border-gray-700 rounded px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingReservation(null)}
                className="px-4 py-2 rounded bg-gray-800 text-xs font-semibold text-gray-300"
              >
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateReservation(editingReservation);
                  setEditingReservation(null);
                  showNotification(lang === 'es' ? 'Reservación actualizada' : 'Booking updated');
                }}
                className="btn-wine-red px-5 py-2 rounded text-xs font-bold"
              >
                {lang === 'es' ? 'Guardar Cambios' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
