'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Language, TourPackage } from '@/lib/types';
import { translations } from '@/lib/translations';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourPackage | null;
  lang: Language;
  onBookTour: (tourId: string) => void;
}

export function ExperienceModal({
  isOpen,
  onClose,
  tour,
  lang,
  onBookTour
}: ExperienceModalProps) {
  if (!isOpen || !tour) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        id="experience-detail-modal"
        className="relative w-full max-w-4xl bg-[#0f1722] border border-[#c5a059]/40 rounded-2xl shadow-2xl overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="relative h-56 sm:h-72 w-full shrink-0">
          <Image
            src={tour.imageUrl}
            alt={tour.name[lang]}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1722] via-[#0f1722]/50 to-transparent" />
          
          <button
            type="button"
            id="close-experience-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:text-[#d4af37] hover:bg-black/80 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8c1d24] text-[#ffd778] text-xs font-bold uppercase tracking-wider mb-2 border border-[#d4af37]/40">
              {tour.highlightBadge?.[lang] || 'Roatán Adventure'}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {tour.name[lang]}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-1">
              {tour.subtitle[lang]}
            </p>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Key Course Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-[#162230] p-4 rounded-xl border border-[#c5a059]/20 text-center">
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.ziplines}</span>
              <span className="text-xl font-bold text-[#d4af37]">{tour.stats.ziplines}</span>
            </div>
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.platforms}</span>
              <span className="text-xl font-bold text-[#d4af37]">{tour.stats.platforms}</span>
            </div>
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.height}</span>
              <span className="text-sm sm:text-base font-bold text-white">{tour.stats.maxHeight}</span>
            </div>
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.length}</span>
              <span className="text-sm sm:text-base font-bold text-white">{tour.stats.totalLength}</span>
            </div>
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.duration}</span>
              <span className="text-sm sm:text-base font-bold text-[#ffd778]">{tour.stats.duration}</span>
            </div>
            <div className="p-2">
              <span className="block text-xs uppercase text-gray-400 font-semibold">{t.experience.stats.difficulty}</span>
              <span className="text-xs font-bold text-emerald-400 mt-1 block">{tour.stats.difficulty[lang]}</span>
            </div>
          </div>

          {/* Detailed Narrative Description */}
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-3">
              {lang === 'es' ? 'Descripción del Recorrido' : 'Tour Course Overview'}
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              {tour.description[lang]}
            </p>
          </div>

          {/* Tour Flow / Step-by-Step Experience */}
          <div className="bg-[#131d28] p-5 rounded-xl border border-gray-800">
            <h4 className="font-heading text-lg font-bold text-[#d4af37] mb-4">
              {lang === 'es' ? 'Cómo se Desarrolla la Actividad' : 'How the Adventure Unfolds'}
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#8c1d24] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#d4af37]">1</div>
                <div>
                  <h5 className="font-semibold text-white text-sm">
                    {lang === 'es' ? 'Recepción y Colocación de Equipos' : 'Welcome & Pro Gear Fitting'}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                    {lang === 'es'
                      ? 'Llegada al campamento base, resguardo de pertenencias en casilleros seguros e instalación de arnés y casco Petzl por guías certificados.'
                      : 'Arrival at base camp, secure belongings in lockers, and precision harness and helmet fitting by certified guides.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#8c1d24] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#d4af37]">2</div>
                <div>
                  <h5 className="font-semibold text-white text-sm">
                    {lang === 'es' ? 'Orientación de Seguridad y Pista de Práctica' : 'Safety Briefing & Ground Test Run'}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                    {lang === 'es'
                      ? 'Demostración de posturas de vuelo, frenado asistido por gravedad y práctica guiada a nivel del suelo antes de ascender.'
                      : 'Demonstration of flight postures, hands-free gravity braking, and hands-on ground practice before climbing up.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#8c1d24] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#d4af37]">3</div>
                <div>
                  <h5 className="font-semibold text-white text-sm">
                    {lang === 'es' ? 'Travesía por los 9 Cables y Plataformas' : 'Flight across 9 Ziplines & Sky Platforms'}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                    {lang === 'es'
                      ? 'Vuela sobre valles selváticos de hasta 320 pies de elevación y contempla vistas 360° del océano Atlántico y el arrecife coralino.'
                      : 'Soar over jungle valleys up to 320 ft in elevation with panoramic 360° vistas of both Roatan coastlines and turquoise coral reefs.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#8c1d24] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#d4af37]">4</div>
                <div>
                  <h5 className="font-semibold text-white text-sm">
                    {lang === 'es' ? 'Cierre, Hidratación y Retorno Garantizado' : 'Finish, Refreshments & Return Transit'}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                    {lang === 'es'
                      ? 'Llegada al mirador pirata, hidratación fría y retorno coordinado a su barco de crucero o resort con tiempo de sobra.'
                      : 'Land at the pirate viewpoint, enjoy cold hydration, and private return transit back to your cruise ship or hotel.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Included vs Not Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#101923] p-5 rounded-xl border border-emerald-800/40">
              <h4 className="font-semibold text-emerald-400 text-base mb-3">
                {lang === 'es' ? 'Qué Incluye' : 'What is Included'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {tour.features[lang].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-base font-bold leading-none">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#101923] p-5 rounded-xl border border-amber-800/40">
              <h4 className="font-semibold text-amber-400 text-base mb-3">
                {lang === 'es' ? 'Qué No Incluye' : 'What is Not Included'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 text-base font-bold leading-none">•</span>
                  <span>{lang === 'es' ? 'Fotografías profesionales y videos con dron (disponibles para compra opcional)' : 'Professional photo and drone packages (available for optional purchase)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 text-base font-bold leading-none">•</span>
                  <span>{lang === 'es' ? 'Propinas voluntarias para sus guías locales' : 'Voluntary gratuities for your local canopy guides'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 text-base font-bold leading-none">•</span>
                  <span>{lang === 'es' ? 'Alimentos o bebidas alcohólicas adicionales en el mirador' : 'Food or alcoholic beverages at the island viewpoint'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Requirements & What to Bring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121c27] p-5 rounded-xl border border-[#c5a059]/30">
            <div>
              <h4 className="font-heading text-sm font-bold uppercase text-[#d4af37] mb-2 tracking-wider">
                {lang === 'es' ? 'Requisitos y Restricciones' : 'Requirements & Restrictions'}
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li>• {lang === 'es' ? 'Edad mínima: 5 años cumplidos.' : 'Minimum age: 5 years old.'}</li>
                <li>• {lang === 'es' ? 'Peso mínimo: 50 lbs (23 kg) para vuelo solo.' : 'Minimum weight: 50 lbs (23 kg) for solo flight.'}</li>
                <li>• {lang === 'es' ? 'Peso máximo: 370 lbs.' : 'Maximum weight: 370 lbs.'}</li>
                <li>• {lang === 'es' ? 'No apto para mujeres en estado de embarazo.' : 'Not permitted for pregnant guests.'}</li>
                <li>• {lang === 'es' ? 'No apto para personas con cirugías lumbares recientes.' : 'Not recommended for guests with recent spinal surgery.'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-sm font-bold uppercase text-[#d4af37] mb-2 tracking-wider">
                {lang === 'es' ? 'Qué Debe Llevar el Visitante' : 'What You Should Bring'}
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <li>• {lang === 'es' ? 'Calzado cerrado obligatorio (tenis o botas).' : 'Mandatory closed-toe shoes (sneakers or trail shoes).'}</li>
                <li>• {lang === 'es' ? 'Ropa cómoda y fresca (shorts o bermudas).' : 'Comfortable lightweight athletic clothing.'}</li>
                <li>• {lang === 'es' ? 'Protector solar y repelente de insectos biodegradable.' : 'Biodegradable sunscreen and insect repellent.'}</li>
                <li>• {lang === 'es' ? 'Cámara con correa de seguridad o montura para casco.' : 'Camera with secure strap or chest/helmet mount.'}</li>
                <li>• {lang === 'es' ? 'Efectivo o tarjeta para compras opcionales y propinas.' : 'Cash or card for optional photos and gratuities.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-[#0a0f17] border-t border-[#c5a059]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-400 block">{lang === 'es' ? 'Tarifa desde' : 'Starting from'}</span>
            <span className="text-2xl font-bold text-[#d4af37]">${tour.priceAdult} USD</span>
            <span className="text-xs text-gray-400 ml-1">/ {lang === 'es' ? 'adulto' : 'adult'}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-gray-700 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-1/2 sm:w-auto text-center"
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
            <button
              type="button"
              id="modal-book-this-tour-btn"
              onClick={() => {
                onClose();
                onBookTour(tour.id);
              }}
              className="btn-wine-red px-7 py-2.5 rounded-full text-sm font-bold tracking-wide w-1/2 sm:w-auto text-center"
            >
              {t.experience.bookTour}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
