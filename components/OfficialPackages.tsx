'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Waves, Binoculars, ShipWheel, Trees, PawPrint, Anchor, Map } from 'lucide-react';
import { Language } from '@/lib/types';

const packages = [
  { icon: Trees, price: 65, en: 'Pirates Zipline Tour', es: 'Tour de Tirolesa Pirates', featuresEn: ['Round-trip transportation', 'Guided zipline tour', 'Gravity-assisted auto-braking'], featuresEs: ['Transporte ida y vuelta', 'Tour guiado de tirolesa', 'Frenado automático asistido'] },
  { icon: PawPrint, price: 35, en: 'Animal Park Adventure', es: 'Aventura en Parque Animal', featuresEn: ['Choose your favorite animal park', 'Sloths, monkeys & exotic birds', 'Add zipline for $65'], featuresEs: ['Elige tu parque favorito', 'Perezosos, monos y aves exóticas', 'Agrega tirolesa por $65'] },
  { icon: Map, price: 40, en: 'Private Island Tour', es: 'Tour Privado por la Isla', featuresEn: ['Private bilingual guide', 'Custom itinerary & sightseeing', 'Beach, culture and shopping'], featuresEs: ['Guía bilingüe privado', 'Itinerario personalizado', 'Playa, cultura y compras'] },
  { icon: Waves, price: 65, en: 'Clear Boat Adventure', es: 'Aventura en Bote Transparente', featuresEn: ['Boat ride over French Cay reef', 'Underwater sightseeing', 'Optional guided snorkeling'], featuresEs: ['Paseo sobre el arrecife French Cay', 'Vistas submarinas', 'Snorkel guiado opcional'] },
  { icon: ShipWheel, price: 75, en: 'Glass Bottom Boat', es: 'Bote con Fondo de Cristal', featuresEn: ['See the world-famous reef', 'Comfortable for all ages', 'Optional beach break'], featuresEs: ['Observa el famoso arrecife', 'Cómodo para todas las edades', 'Parada de playa opcional'] },
  { icon: Anchor, price: 45, en: 'Private Island Beach Break', es: 'Día de Playa en Isla Privada', featuresEn: ['Private white-sand beach', 'Beach chairs & restrooms', 'On-site restaurant'], featuresEs: ['Playa privada de arena blanca', 'Sillas y baños incluidos', 'Restaurante en el lugar'] },
  { icon: Binoculars, price: 50, en: 'Reef Snorkel Adventure', es: 'Aventura de Snorkel en el Arrecife', featuresEn: ['Guided reef snorkeling', 'Boat ride & bilingual guide', 'All snorkel gear included'], featuresEs: ['Snorkel guiado en el arrecife', 'Bote y guía bilingüe', 'Todo el equipo incluido'] }
];

export function OfficialPackages({ lang }: { lang: Language }) {
  return (
    <section className="pirate-packages relative overflow-hidden py-24">
      <div className="pirate-chart-glow" />
      <div className="pirate-compass-mark" aria-hidden="true"><span /><span /><span /></div>
      <div className="pirate-chart relative mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-12 grid gap-7 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div>
            <p className="pirate-chart-eyebrow"><ShipWheel className="h-4 w-4" />{lang === 'en' ? "The Captain's Route Collection" : 'La Colección de Rutas del Capitán'}</p>
            <h2 className="pirate-chart-title mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl">{lang === 'en' ? 'One island. Seven unforgettable ways to explore it.' : 'Una isla. Siete formas inolvidables de descubrirla.'}</h2>
          </div>
          <div className="pirate-chart-side lg:justify-self-end">
            <div className="home-adventure-seal" aria-label={lang === 'es' ? 'Sello oficial de canopy en Roatán' : 'Official Roatan canopy seal'}>
              <span><Image src="/brand/pirates-logo.png" alt="Pirates of the Caribbean Zipline" fill sizes="100px" className="object-contain" /></span>
              <strong>{lang === 'es' ? 'Canopy Oficial de Roatán' : 'Official Roatan Canopy'}</strong>
              <small>{lang === 'es' ? 'Reserva Directa' : 'Direct Booking'}</small>
            </div>
            <p className="pirate-chart-intro max-w-xl text-base leading-7">{lang === 'en' ? 'Chart your course across Roatan. Every route includes transportation and selected voyages can be paired with our signature extreme zipline.' : 'Traza tu rumbo por Roatán. Cada ruta incluye transporte y las travesías seleccionadas pueden combinarse con nuestra tirolesa extrema.'}</p>
          </div>
        </div>
        <div className="pirate-route-line" aria-hidden="true" />
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item, index) => {
            const Icon = item.icon;
            return <article key={item.en} className={`package-card pirate-package-card group ${index === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-[.75fr_1fr] lg:items-center' : ''}`}>
              <div className="p-7">
                <div className="mb-7 flex items-start justify-between gap-5"><span className="pirate-package-icon"><Icon className="h-6 w-6" /></span><div className="pirate-package-price text-right"><span className="block text-[10px] font-bold uppercase tracking-[.2em]">{lang === 'en' ? 'Passage from' : 'Pasaje desde'}</span><strong className="font-heading text-3xl">${item.price}</strong><span className="ml-1 text-xs">/ {lang === 'en' ? 'person' : 'persona'}</span></div></div>
                <h3 className="pirate-package-title font-heading text-2xl font-bold transition">{lang === 'en' ? item.en : item.es}</h3>
              </div>
              <div className="pirate-package-details border-t p-7 lg:border-l lg:border-t-0">
                <ul className="space-y-3">{(lang === 'en' ? item.featuresEn : item.featuresEs).map(feature => <li key={feature} className="flex gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0" />{feature}</li>)}</ul>
                <Link href="/reservar" className="pirate-package-link mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em]">{lang === 'en' ? 'Reserve this voyage' : 'Reservar esta travesía'}<ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
