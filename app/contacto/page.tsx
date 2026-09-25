'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/PageHeader';
import { FaqSection } from '@/components/FaqSection';

export default function ContactoPage() {
  const { lang, siteConfig, faqs } = useAppStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    shipOrHotel: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  const cleanPhone = siteConfig.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = siteConfig.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#070b10] min-h-screen">
      {/* Page Header */}
      <PageHeader
        lang={lang}
        badge={lang === 'es' ? 'Atención al Cliente' : 'Customer Support'}
        title={
          lang === 'es'
            ? 'Contacto y Asistencia al Visitante'
            : 'Contact & Guest Support'
        }
        subtitle={
          lang === 'es'
            ? 'Comunícate directamente con nuestro equipo de operaciones en Roatán. Coordinamos tu recogida en puerto, respondemos preguntas sobre itinerarios y gestionamos visitas para grupos.'
            : 'Connect directly with our local operations desk in Roatan. We coordinate cruise port pickups, answer itinerary questions, and manage private group tours.'
        }
        breadcrumbs={[
          {
            label: lang === 'es' ? 'Contacto' : 'Contact'
          }
        ]}
      />

      {/* Main Contact Grid: Cards + Inquiry Form */}
      <section className="py-16 bg-[#090f16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Direct Contact Details & Working Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block mb-2">
                  {lang === 'es' ? 'Canales Directos' : 'Direct Channels'}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  {lang === 'es' ? '¿Cómo podemos ayudarte?' : 'How can we help you?'}
                </h2>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {lang === 'es'
                    ? 'Nuestro equipo bilingüe (español e inglés) monitorea en tiempo real los horarios de atraque de los barcos para que no te preocupes por retrasos.'
                    : 'Our bilingual team (English and Spanish) tracks cruise docking schedules in real-time so you never have to worry about port delays.'}
                </p>
              </div>

              {/* Contact Channels Cards */}
              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    lang === 'es'
                      ? 'Hola Pirates Zipline, deseo información sobre sus tours en Roatán.'
                      : 'Hello Pirates Zipline, I would like more information about your canopy tours in Roatan.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#111923] border border-[#c5a059]/30 hover:border-[#ffd778] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      WhatsApp Oficial
                    </span>
                    <span className="text-base font-bold text-white group-hover:text-[#ffd778] transition-colors">
                      {siteConfig.whatsapp}
                    </span>
                    <span className="text-xs text-emerald-400 block mt-0.5">
                      {lang === 'es' ? 'Respuesta inmediata' : 'Fast immediate response'}
                    </span>
                  </div>
                </a>

                {/* Telephone */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#111923] border border-[#c5a059]/30 hover:border-[#ffd778] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#162230] border border-[#c5a059]/40 flex items-center justify-center text-[#ffd778] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {lang === 'es' ? 'Línea Telefónica Directa' : 'Direct Phone Line'}
                    </span>
                    <span className="text-base font-bold text-white group-hover:text-[#ffd778] transition-colors">
                      {siteConfig.phone}
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      {lang === 'es' ? 'Atención local e internacional' : 'Local & international assistance'}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#111923] border border-[#c5a059]/30 hover:border-[#ffd778] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#162230] border border-[#c5a059]/40 flex items-center justify-center text-[#ffd778] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {lang === 'es' ? 'Correo Electrónico' : 'Email Support'}
                    </span>
                    <span className="text-base font-bold text-white group-hover:text-[#ffd778] transition-colors break-all">
                      {siteConfig.email}
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      {lang === 'es' ? 'Cotizaciones y reservas grupales' : 'Group quotes & inquiries'}
                    </span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#111923] border border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-[#162230] border border-gray-700 flex items-center justify-center text-[#ffd778] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {lang === 'es' ? 'Ubicación de Parque' : 'Park Location'}
                    </span>
                    <span className="text-sm font-medium text-white block mt-0.5">
                      {siteConfig.address}
                    </span>
                    <span className="text-xs text-[#c5a059] block mt-1">
                      {siteConfig.municipality}, {siteConfig.department}, {siteConfig.country}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#111923] border border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-[#162230] border border-gray-700 flex items-center justify-center text-[#ffd778] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {lang === 'es' ? 'Horario de Operación' : 'Hours of Operation'}
                    </span>
                    <span className="text-sm font-medium text-white block mt-0.5">
                      {lang === 'es'
                        ? 'Lunes a Domingo: 8:00 AM - 5:00 PM'
                        : 'Monday to Sunday: 8:00 AM - 5:00 PM'}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">
                      {lang === 'es'
                        ? 'Adaptados a las llegadas y salidas de todos los barcos'
                        : 'Adjusted to match all cruise ship arrival and departure windows'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#111923] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-10 shadow-xl relative">
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#ffd778] uppercase tracking-widest block mb-1">
                    {lang === 'es' ? 'Formulario de Consulta' : 'Inquiry Form'}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    {lang === 'es' ? 'Envíanos un Mensaje Directo' : 'Send Us a Direct Message'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {lang === 'es'
                      ? 'Te responderemos en menos de 2 horas con toda la información solicitada.'
                      : 'We will get back to you within 2 hours with all required tour details.'}
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400 mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-white mb-2">
                      {lang === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Message Sent Successfully!'}
                    </h4>
                    <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
                      {lang === 'es'
                        ? `Gracias ${formData.name}. Hemos recibido tu mensaje y nuestro equipo de Roatán te contactará a ${formData.email} a la brevedad.`
                        : `Thank you ${formData.name}. We received your inquiry and our Roatan team will reach back to ${formData.email} shortly.`}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            date: '',
                            shipOrHotel: '',
                            message: ''
                          });
                        }}
                        className="btn-gold-outline px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        {lang === 'es' ? 'Enviar Otro Mensaje' : 'Send Another Message'}
                      </button>
                      <Link
                        href="/reservar"
                        className="btn-wine-red px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        {lang === 'es' ? 'Ir a Reservar Ahora' : 'Go to Book Now'}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          {lang === 'es' ? 'Nombre completo *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={lang === 'es' ? 'Ej. Carlos Méndez' : 'e.g. John Doe'}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          {lang === 'es' ? 'Correo electrónico *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@email.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          {lang === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 555-0123"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          {lang === 'es' ? 'Fecha Estimada' : 'Estimated Date'}
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        {lang === 'es' ? 'Barco de Crucero u Hotel' : 'Cruise Ship or Hotel'}
                      </label>
                      <input
                        type="text"
                        value={formData.shipOrHotel}
                        onChange={(e) => setFormData({ ...formData, shipOrHotel: e.target.value })}
                        placeholder={
                          lang === 'es'
                            ? 'Ej. Carnival Vista / Grand Roatan Resort'
                            : 'e.g. Wonder of the Seas / West Bay Resort'
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        {lang === 'es' ? 'Mensaje o Pregunta *' : 'Message or Question *'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          lang === 'es'
                            ? 'Cuéntanos qué necesitas: número de personas, edades, consultas sobre horarios o traslados...'
                            : 'Tell us about your party: number of guests, kids, schedule questions or custom pickup requests...'
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090f16] border border-gray-700 text-white text-sm focus:border-[#ffd778] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-wine-red w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'es' ? 'Enviar Mensaje' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete FAQs Section */}
      <FaqSection lang={lang} faqs={faqs} />
    </div>
  );
}
