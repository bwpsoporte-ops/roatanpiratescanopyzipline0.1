import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, MapPin, Ship, Trees } from 'lucide-react';
import { createMetadata, siteUrl } from '@/lib/seo';

export const metadata = {
  ...createMetadata({
  title: 'Tirolesa y Excursiones en Roatán, Honduras | Pirates Canopy',
  description: 'Reserva canopy, tirolesa, snorkel, bote transparente, parques de animales y tours privados en Roatán con transporte y guías bilingües.',
  path: '/es',
    keywords: ['turismo Roatán Honduras','tirolesa Roatán','canopy Roatán','excursiones en Roatán','qué hacer en Roatán','tours Roatán Honduras']
  }),
  alternates: { canonical: `${siteUrl}/es`, languages: { 'en': siteUrl, 'es': `${siteUrl}/es`, 'x-default': siteUrl } }
};

export default function SpanishLandingPage() {
  return (
    <div lang="es" className="bg-[#070b10] text-white">
      <section className="relative min-h-[76vh] overflow-hidden">
        <Image src="/image/homeweb.jpeg" alt="Excursión en bote transparente en Roatán, Honduras" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c]/95 via-[#071019]/80 to-black/30" />
        <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">Turismo y aventura en Roatán, Honduras</p><h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-6xl">Tirolesa, arrecife y experiencias inolvidables en el Caribe</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Descubre Roatán con un equipo local: canopy extremo, bote transparente, snorkel, parques de perezosos, playa privada y tours personalizados para pasajeros de crucero.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/reservar" className="btn-wine-red rounded-full px-8 py-4 text-center font-bold">Reservar una excursión</Link><Link href="/precios" className="btn-gold-outline rounded-full px-8 py-4 text-center font-bold">Consultar precios</Link></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="grid gap-8 md:grid-cols-3">
        <article className="package-card p-7"><Trees className="h-7 w-7 text-[#e8c56c]" /><h2 className="mt-5 font-heading text-xl font-bold">Canopy y tirolesa</h2><p className="mt-3 text-sm leading-7 text-slate-400">Una aventura guiada, apta para familias y visitantes que vuelan por primera vez.</p></article>
        <article className="package-card p-7"><Ship className="h-7 w-7 text-[#e8c56c]" /><h2 className="mt-5 font-heading text-xl font-bold">Excursiones para cruceros</h2><p className="mt-3 text-sm leading-7 text-slate-400">Transporte ida y vuelta desde Mahogany Bay y Coxen Hole, coordinado con el horario del barco.</p></article>
        <article className="package-card p-7"><MapPin className="h-7 w-7 text-[#e8c56c]" /><h2 className="mt-5 font-heading text-xl font-bold">Tours locales de Roatán</h2><p className="mt-3 text-sm leading-7 text-slate-400">Conoce playas, arrecifes, fauna, cultura, gastronomía y los mejores paisajes de la isla.</p></article>
      </div></section>
      <section className="border-y border-white/8 bg-[#0c131c] py-20"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow">Por qué reservar con nosotros</p><h2 className="mt-4 font-heading text-3xl font-bold">Tu día en Roatán, organizado por un equipo local</h2></div><ul className="space-y-4 text-slate-300">{['Sin cargos ocultos','Garantía No Port, No Pay','Guías bilingües','Opciones para familias y grupos','Transporte disponible desde puertos, hoteles y resorts'].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d4af37]" />{item}</li>)}</ul></div></section>
    </div>
  );
}
