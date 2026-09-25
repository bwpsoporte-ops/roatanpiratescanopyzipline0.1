'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  MessageCircle
} from 'lucide-react';
import { Language, Reservation, TourPackage, SiteConfig } from '@/lib/types';
import { translations } from '@/lib/translations';

interface BookingSectionProps {
  lang: Language;
  tours: TourPackage[];
  siteConfig: SiteConfig;
  onAddReservation: (booking: Omit<Reservation, 'id' | 'code' | 'createdAt'>) => Promise<Reservation>;
  preSelectedTourId?: string;
}

export function BookingSection({
  lang,
  tours,
  siteConfig,
  onAddReservation,
  preSelectedTourId
}: BookingSectionProps) {
  const t = translations[lang];

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [tourId, setTourId] = useState<string>(preSelectedTourId || (tours[0]?.id ?? 'canopy-extrem-classic'));
  const [lodgingType, setLodgingType] = useState<'Crucero' | 'Hotel' | 'Airbnb' | 'Residente'>('Crucero');
  const [hotelOrAddress, setHotelOrAddress] = useState('');
  const [needsTransport, setNeedsTransport] = useState<boolean>(true);
  const [specialRequests, setSpecialRequests] = useState('');

  // Cruise Specific Fields
  const [shipName, setShipName] = useState('');
  const [arrivalPort, setArrivalPort] = useState<'Mahogany Bay' | 'Coxen Hole (Town Center)' | 'Otro'>('Mahogany Bay');
  const [shipArrivalTime, setShipArrivalTime] = useState('08:00 AM');
  const [shipDepartureTime, setShipDepartureTime] = useState('05:00 PM');
  const [cruisePassengersCount, setCruisePassengersCount] = useState<number>(2);
  const [transportPickupLocation, setTransportPickupLocation] = useState('Salida de Seguridad del Puerto (Port Gate Exit)');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Time slots tailored for cruise ships and tourists
  const timeSlots = [
    '08:30 AM',
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM'
  ];

  const selectedTourObj = tours.find((tour) => tour.id === tourId) || tours[0];

  // Estimated calculation
  const totalEstimatedAmount =
    selectedTourObj
      ? adults * selectedTourObj.priceAdult + children * selectedTourObj.priceChild
      : 130;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !email || !date) {
      alert(lang === 'es' ? 'Por favor completa los campos obligatorios.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isCruise = lodgingType === 'Crucero';

      const newReservation = await onAddReservation({
        customerName,
        phone,
        email,
        date,
        timeSlot,
        adults,
        children,
        tourId,
        tourName: selectedTourObj ? selectedTourObj.name[lang] : 'Canopy Zipline',
        totalAmount: totalEstimatedAmount,
        paidAmount: 0,
        lodgingType,
        isCruisePassenger: isCruise,
        hotelOrAddress: isCruise ? undefined : hotelOrAddress,
        shipName: isCruise ? shipName : undefined,
        arrivalPort: isCruise ? arrivalPort : undefined,
        shipArrivalTime: isCruise ? shipArrivalTime : undefined,
        shipDepartureTime: isCruise ? shipDepartureTime : undefined,
        cruisePassengersCount: isCruise ? cruisePassengersCount : undefined,
        transportPickupLocation: isCruise ? transportPickupLocation : undefined,
        needsTransport,
        specialRequests,
        status: 'Pendiente'
      });

      setCreatedReservation(newReservation);
    } catch {
      alert(lang === 'es' ? 'No se pudo guardar la reservación. Inténtalo nuevamente.' : 'The reservation could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Pre-filled text creator
  const getWhatsAppMessageUrl = (res: Reservation) => {
    const rawNumber = siteConfig.whatsapp.replace(/[^0-9]/g, '');
    const text =
      lang === 'es'
        ? `Hola Pirates of the Caribbean Zipline, acabo de enviar mi reservación en su sitio web.%0A%0A*Código de Reserva:* ${res.code}%0A*Nombre:* ${res.customerName}%0A*Fecha:* ${res.date} a las ${res.timeSlot}%0A*Tour:* ${res.tourName}%0A*Adultos:* ${res.adults} | *Niños:* ${res.children}%0A*Hospedaje:* ${res.lodgingType} ${res.shipName ? `(${res.shipName} en ${res.arrivalPort})` : ''}%0A*Transporte:* ${res.needsTransport ? 'Sí requerido' : 'No'}%0A*Total estimado:* $${res.totalAmount} USD%0A%0A¿Podrían por favor confirmar mi espacio y detalles de recogida? ¡Muchas gracias!`
        : `Hello Pirates of the Caribbean Zipline, I just submitted a reservation on your website.%0A%0A*Booking Code:* ${res.code}%0A*Name:* ${res.customerName}%0A*Date:* ${res.date} at ${res.timeSlot}%0A*Tour:* ${res.tourName}%0A*Adults:* ${res.adults} | *Kids:* ${res.children}%0A*Lodging:* ${res.lodgingType} ${res.shipName ? `(${res.shipName} at ${res.arrivalPort})` : ''}%0A*Transport:* ${res.needsTransport ? 'Yes required' : 'No'}%0A*Estimated Total:* $${res.totalAmount} USD%0A%0ACould you please verify availability and confirm my spot? Thank you!`;

    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  return (
    <section id="reservar" className="py-24 bg-[#090e15] relative text-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
            {t.booking.badge}
          </span>
          <h2
            id="booking-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            {t.booking.title}
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-gray-300">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Parchment-framed Booking Form */}
        <div className="bg-parchment text-[#241f17] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border-2 border-[#c5a059] relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal / Contact Information */}
            <div>
              <div className="border-b border-[#b89f72]/40 pb-2 mb-4">
                <span className="text-[11px] font-bold text-[#8c1d24] uppercase tracking-wider block">
                  {lang === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3'}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#1a140f]">
                  {t.booking.personalInfo}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Sarah Jenkins"
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 305 555 0192"
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Date, Time & Group Details */}
            <div>
              <div className="border-b border-[#b89f72]/40 pb-2 mb-4">
                <span className="text-[11px] font-bold text-[#8c1d24] uppercase tracking-wider block">
                  {lang === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3'}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#1a140f]">
                  {lang === 'es' ? 'Detalles de la Excursión' : 'Excursion Schedule & Party'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.date} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.timeSlot}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.adults}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.children}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience selection dropdown */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                  {t.booking.experience}
                </label>
                <select
                  value={tourId}
                  onChange={(e) => setTourId(e.target.value)}
                  className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none font-medium"
                >
                  {tours.map((tItem) => (
                    <option key={tItem.id} value={tItem.id}>
                      {tItem.name[lang]} — ${tItem.priceAdult} USD ({tItem.stats.duration})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Lodging & Transportation */}
            <div>
              <div className="border-b border-[#b89f72]/40 pb-2 mb-4">
                <span className="text-[11px] font-bold text-[#8c1d24] uppercase tracking-wider block">
                  {lang === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3'}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#1a140f]">
                  {lang === 'es' ? 'Hospedaje y Traslados' : 'Lodging & Round-trip Transit'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.lodging}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLodgingType('Crucero')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        lodgingType === 'Crucero'
                          ? 'bg-[#8c1d24] text-white border-[#8c1d24] shadow'
                          : 'bg-[#fdfaf5] text-[#44382c] border-[#b89f72]'
                      }`}
                    >
                      {t.booking.lodgingOptions.cruise}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLodgingType('Hotel')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        lodgingType === 'Hotel'
                          ? 'bg-[#8c1d24] text-white border-[#8c1d24] shadow'
                          : 'bg-[#fdfaf5] text-[#44382c] border-[#b89f72]'
                      }`}
                    >
                      {t.booking.lodgingOptions.hotel}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLodgingType('Airbnb')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        lodgingType === 'Airbnb'
                          ? 'bg-[#8c1d24] text-white border-[#8c1d24] shadow'
                          : 'bg-[#fdfaf5] text-[#44382c] border-[#b89f72]'
                      }`}
                    >
                      {t.booking.lodgingOptions.airbnb}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLodgingType('Residente')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        lodgingType === 'Residente'
                          ? 'bg-[#8c1d24] text-white border-[#8c1d24] shadow'
                          : 'bg-[#fdfaf5] text-[#44382c] border-[#b89f72]'
                      }`}
                    >
                      {t.booking.lodgingOptions.local}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.needsTransport}
                  </label>
                  <div className="flex gap-3 mt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#2e261d] cursor-pointer bg-[#fdfaf5] px-4 py-2.5 rounded-xl border border-[#b89f72]">
                      <input
                        type="radio"
                        checked={needsTransport === true}
                        onChange={() => setNeedsTransport(true)}
                        className="text-[#8c1d24] focus:ring-[#8c1d24]"
                      />
                      <span>{t.booking.yes}</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-[#2e261d] cursor-pointer bg-[#fdfaf5] px-4 py-2.5 rounded-xl border border-[#b89f72]">
                      <input
                        type="radio"
                        checked={needsTransport === false}
                        onChange={() => setNeedsTransport(false)}
                        className="text-[#8c1d24] focus:ring-[#8c1d24]"
                      />
                      <span>{t.booking.no}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditional Cruise Fields (Required when Crucero is selected) */}
              {lodgingType === 'Crucero' ? (
                <div className="mt-6 p-5 rounded-2xl bg-[#ebdec7] border border-[#b89f72] space-y-4 animate-in fade-in">
                  <div>
                    <h4 className="font-heading text-base font-bold text-[#1a140f]">
                      {t.booking.cruiseSectionTitle}
                    </h4>
                    <p className="text-xs text-[#5c4e3c] mt-0.5">
                      {t.booking.cruiseSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                        {t.booking.shipName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipName}
                        onChange={(e) => setShipName(e.target.value)}
                        placeholder="Ej. Carnival Horizon"
                        className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                        {t.booking.arrivalPort}
                      </label>
                      <select
                        value={arrivalPort}
                        onChange={(e) => setArrivalPort(e.target.value as any)}
                        className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none font-medium"
                      >
                        <option value="Mahogany Bay">Mahogany Bay (Carnival, Princess, HAL)</option>
                        <option value="Coxen Hole (Town Center)">Coxen Hole (Royal Caribbean, NCL, Celebrity)</option>
                        <option value="Otro">Otro fondeadero</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                        {t.booking.passengersCount}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cruisePassengersCount}
                        onChange={(e) => setCruisePassengersCount(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                        {t.booking.shipArrival}
                      </label>
                      <input
                        type="text"
                        value={shipArrivalTime}
                        onChange={(e) => setShipArrivalTime(e.target.value)}
                        placeholder="Ej. 08:00 AM"
                        className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                        {t.booking.shipDeparture}
                      </label>
                      <input
                        type="text"
                        value={shipDepartureTime}
                        onChange={(e) => setShipDepartureTime(e.target.value)}
                        placeholder="Ej. 05:00 PM (Hora de salida)"
                        className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                    {t.booking.hotelName}
                  </label>
                  <input
                    type="text"
                    value={hotelOrAddress}
                    onChange={(e) => setHotelOrAddress(e.target.value)}
                    placeholder="Ej. Grand Roatan Resort, West Bay"
                    className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-xs font-bold text-[#44382c] uppercase mb-1">
                {t.booking.message}
              </label>
              <textarea
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={lang === 'es' ? 'Ej. Vamos con niños pequeños, favor incluir tándem / Celebrando cumpleaños...' : 'E.g. We have young kids / Celebrating an anniversary...'}
                className="w-full bg-[#fdfaf5] border border-[#b89f72] rounded-xl px-4 py-2.5 text-sm text-[#1a140f] focus:ring-2 focus:ring-[#8c1d24] focus:outline-none"
              />
            </div>

            {/* Estimated Total & Status Disclaimer */}
            <div className="bg-[#ede3ce] p-4 rounded-2xl border border-[#b89f72] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#5c4e3c] block">
                  {lang === 'es' ? 'Monto estimado a pagar en check-in' : 'Estimated amount due at check-in'}:
                </span>
                <span className="text-2xl font-extrabold text-[#8c1d24]">
                  ${totalEstimatedAmount} USD
                </span>
                <span className="text-xs text-[#5c4e3c] ml-2">
                  ({adults} {lang === 'es' ? 'adultos' : 'adults'}{children > 0 ? `, ${children} ${lang === 'es' ? 'niños' : 'children'}` : ''})
                </span>
              </div>

              <div className="text-center sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-400 font-bold text-xs mb-1">
                  {t.booking.statusPending}
                </span>
                <p className="text-[11px] text-[#5c4e3c]">
                  {t.booking.guarantee}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="booking-submit-btn"
              className="btn-wine-red w-full py-4 rounded-full text-base sm:text-lg font-bold tracking-wide shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? t.booking.submitting : t.booking.submitBtn}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation & Voucher Modal */}
      {createdReservation && (
        <div
          id="booking-success-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative w-full max-w-xl bg-parchment text-[#241f17] border-2 border-[#c5a059] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#8c1d24] text-white flex items-center justify-center mx-auto mb-4 shadow-lg border border-[#ffd778]">
                <CheckCircle2 className="w-8 h-8 text-[#ffd778]" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a140f]">
                {t.booking.modalSuccess.title}
              </h3>
              
              <div className="my-4 bg-[#fdfaf5] border border-[#b89f72] p-4 rounded-2xl">
                <span className="text-xs text-[#5c4e3c] uppercase font-bold block">
                  {t.booking.modalSuccess.codeLabel}
                </span>
                <span className="text-3xl font-extrabold text-[#8c1d24] tracking-wider">
                  {createdReservation.code}
                </span>
                <div className="text-xs text-gray-700 mt-2">
                  <p><strong>{createdReservation.customerName}</strong></p>
                  <p>{createdReservation.date} • {createdReservation.timeSlot}</p>
                  <p>{createdReservation.tourName}</p>
                  <p>{createdReservation.adults} {lang === 'es' ? 'adultos' : 'adults'} | Total: ${createdReservation.totalAmount} USD</p>
                </div>
              </div>

              <p className="text-xs text-[#44382c] leading-relaxed mb-6">
                {t.booking.modalSuccess.statusNotice}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppMessageUrl(createdReservation)}
                  target="_blank"
                  rel="noreferrer"
                  id="whatsapp-summary-send-btn"
                  className="btn-wine-red flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{t.booking.modalSuccess.sendWhatsapp}</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-3 rounded-full border border-[#8c1d24] text-[#8c1d24] hover:bg-[#8c1d24] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.booking.modalSuccess.printVoucher}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCreatedReservation(null)}
                className="mt-4 text-xs font-bold text-gray-600 hover:text-black underline"
              >
                {t.booking.modalSuccess.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
