'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuickActions } from './QuickActions';
import { AdminPanel } from './AdminPanel';
import { AdminUser } from '@/lib/types';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin.bwp';
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const {
    lang,
    setLang,
    siteConfig,
    updateSiteConfig,
    tours,
    updateTours,
    prices,
    updatePrices,
    gallery,
    updateGallery,
    reservations,
    updateReservationStatus,
    updateReservation,
    deleteReservation,
    reviews,
    updateReviews,
    faqs,
    updateFaqs,
    isAdminOpen,
    setIsAdminOpen,
    refreshAdminData
  } = useAppStore();

  const handleBookClick = () => {
    router.push('/reservar');
  };

  const loadAdminUsers = useCallback(async () => {
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    if (response.ok) setAdminUsers(await response.json());
    else setAdminUsers([]);
  }, []);

  useEffect(() => {
    if (!isAdminRoute) return;
    let active = true;
    fetch('/api/admin/auth', { cache: 'no-store' })
      .then((response) => response.json())
      .then(async (result) => {
        if (!active || !result.authenticated || !result.user) return;
        setCurrentAdmin(result.user);
        setAdminAuthenticated(true);
        setIsAdminOpen(true);
        await Promise.all([refreshAdminData(), result.user.role === 'Administrador general' ? loadAdminUsers() : Promise.resolve()]);
      })
      .catch(() => undefined)
      .finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, [isAdminRoute, setIsAdminOpen, refreshAdminData, loadAdminUsers]);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError(false);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      if (!response.ok) throw new Error('login');
      const result = await response.json();
      setCurrentAdmin(result.user);
      setAdminAuthenticated(true);
      setIsAdminOpen(true);
      setAdminPassword('');
      await Promise.all([refreshAdminData(), result.user.role === 'Administrador general' ? loadAdminUsers() : Promise.resolve()]);
    } catch {
      setLoginError(true);
    } finally {
      setLoginLoading(false);
    }
  };

  const syncAdminUsers = async (nextUsers: AdminUser[]) => {
    const added = nextUsers.find((user) => !adminUsers.some((existing) => existing.id === user.id));
    const removed = adminUsers.find((user) => !nextUsers.some((next) => next.id === user.id));
    const changed = nextUsers.find((user) => {
      const existing = adminUsers.find((item) => item.id === user.id);
      return existing && (existing.isActive !== user.isActive || existing.role !== user.role);
    });
    if (added) {
      await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(added) });
    } else if (removed) {
      await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: removed.id }) });
    } else if (changed) {
      await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: changed.id, isActive: changed.isActive, role: changed.role }) });
    }
    await loadAdminUsers();
  };

  if (isAdminRoute && checkingSession) {
    return <main className="admin-login-shell min-h-screen grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" aria-label="Checking secure session" /></main>;
  }

  if (isAdminRoute && !adminAuthenticated) {
    return (
      <main className="admin-login-shell min-h-screen grid place-items-center px-5 py-12">
        <div className="admin-login-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[.9fr_1.1fr]">
          <section className="admin-login-brand relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-12 lg:flex">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full border border-[#d8bb78]/15" />
            <div className="relative z-10">
              <div className="relative h-28 w-28"><Image src="/brand/pirates-logo.png" alt="Pirates of the Caribbean Zipline" fill sizes="112px" className="object-contain drop-shadow-2xl" priority /></div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.28em] text-[#d8bb78]">Roatán · Honduras</p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white">Operations, bookings and content in one place.</h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">A private workspace built for the Pirates of the Caribbean Zipline team.</p>
            </div>
            <div className="relative z-10 flex items-center gap-3 text-xs text-slate-400"><span className="h-px w-10 bg-[#d8bb78]" />Secure staff access</div>
          </section>

          <section className="flex flex-col justify-center bg-white p-7 sm:p-12 lg:p-16">
          <div className="mb-7 flex items-center gap-4 lg:hidden">
            <div className="relative h-16 w-16"><Image src="/brand/pirates-logo.png" alt="Pirates of the Caribbean Zipline" fill sizes="64px" className="object-contain" priority /></div>
            <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#9f7a34]">Roatán, Honduras</p><strong className="font-heading text-lg text-[#14202c]">Staff Portal</strong></div>
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-[#9f7a34]">Authorized personnel</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-[#14202c]">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to manage reservations, pricing, content and gallery media.</p>
          <form onSubmit={handleAdminLogin} className="mt-8 space-y-4">
            <label className="block text-xs font-bold text-slate-700" htmlFor="admin-username">Username</label>
            <input id="admin-username" type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} className="admin-login-input" autoComplete="username" required />
            <label className="block text-xs font-bold text-slate-700" htmlFor="admin-password">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7a34]" />
              <input id="admin-password" type={showPassword ? 'text' : 'password'} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="admin-login-input pl-11 pr-12" autoComplete="current-password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Show password">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            {loginError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Incorrect username or password.</p>}
            <button disabled={loginLoading} className="admin-login-submit w-full rounded-xl py-3.5 font-bold disabled:opacity-60" type="submit">{loginLoading ? 'Verifying…' : 'Sign in to dashboard'}</button>
          </form>
          <button onClick={() => router.push('/')} className="mt-6 w-full text-center text-xs text-slate-400 transition hover:text-[#9f7a34]">← Return to public website</button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b10] text-[#f4efe6] selection:bg-[#8c1d24] selection:text-[#ffd778]">
      {/* Universal Fixed Header */}
      {!isAdminRoute && <Header
        lang={lang}
        onLanguageChange={setLang}
        siteConfig={siteConfig}
        onBookClick={handleBookClick}
      />}

      {/* Main Page Content */}
      <main id="main-content" className={`flex-1 ${isAdminRoute ? '' : 'pt-16 sm:pt-20'}`}>
        {children}
      </main>

      {/* Universal Footer */}
      {!isAdminRoute && <Footer
        lang={lang}
        siteConfig={siteConfig}
      />}

      {/* Global Quick Action Floating Buttons (WhatsApp & Mobile Bar) */}
      {!isAdminRoute && <QuickActions
        lang={lang}
        siteConfig={siteConfig}
        onBookClick={handleBookClick}
      />}

      {/* Global Admin Modal */}
      {isAdminRoute && currentAdmin && <AdminPanel
        isOpen={isAdminRoute && adminAuthenticated && isAdminOpen}
        onClose={async () => {
          await fetch('/api/admin/auth', { method: 'DELETE' });
          setIsAdminOpen(false);
          setAdminAuthenticated(false);
          setCurrentAdmin(null);
          setAdminPassword('');
          router.replace('/admin.bwp');
        }}
        lang={lang}
        siteConfig={siteConfig}
        onUpdateSiteConfig={updateSiteConfig}
        reservations={reservations}
        onUpdateReservationStatus={updateReservationStatus}
        onUpdateReservation={updateReservation}
        onDeleteReservation={deleteReservation}
        prices={prices}
        onUpdatePrices={updatePrices}
        tours={tours}
        onUpdateTours={updateTours}
        gallery={gallery}
        onUpdateGallery={updateGallery}
        reviews={reviews}
        onUpdateReviews={updateReviews}
        faqs={faqs}
        onUpdateFaqs={updateFaqs}
        onLanguageChange={setLang}
        currentUser={currentAdmin}
        users={adminUsers}
        onUpdateUsers={syncAdminUsers}
      />}
    </div>
  );
}
