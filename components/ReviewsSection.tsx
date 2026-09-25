'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, Globe2, Mail, MapPin, MessageSquareText, Send, Star, UserRound } from 'lucide-react';
import { Language, ReviewItem } from '@/lib/types';

const countries = [
  ['us', 'United States', 'Estados Unidos'], ['ca', 'Canada', 'Canadá'], ['hn', 'Honduras', 'Honduras'],
  ['mx', 'Mexico', 'México'], ['gt', 'Guatemala', 'Guatemala'], ['sv', 'El Salvador', 'El Salvador'],
  ['ni', 'Nicaragua', 'Nicaragua'], ['cr', 'Costa Rica', 'Costa Rica'], ['pa', 'Panama', 'Panamá'],
  ['bz', 'Belize', 'Belice'], ['gb', 'United Kingdom', 'Reino Unido'], ['es', 'Spain', 'España'],
  ['fr', 'France', 'Francia'], ['de', 'Germany', 'Alemania'], ['it', 'Italy', 'Italia'],
  ['nl', 'Netherlands', 'Países Bajos'], ['au', 'Australia', 'Australia'], ['br', 'Brazil', 'Brasil'],
  ['co', 'Colombia', 'Colombia'], ['ar', 'Argentina', 'Argentina'], ['cl', 'Chile', 'Chile']
] as const;

const flagUrl = (code?: string) => code ? `https://flagcdn.com/24x18/${code.toLowerCase()}.png` : '';
const legacyCountryCode = (location: string) => {
  const value = location.toLowerCase();
  if (value.includes('roatan') || value.includes('roatán') || value.includes('honduras') || value.includes('san pedro')) return 'hn';
  if (value.includes('canada') || value.includes('canadá') || value.includes('montreal') || value.includes('toronto')) return 'ca';
  if (value.includes('miami') || value.includes('texas') || value.includes('austin') || value.includes('usa') || value.includes('united states')) return 'us';
  return '';
};

export function ReviewsSection({ lang, reviews }: { lang: Language; reviews: ReviewItem[] }) {
  const activeReviews = useMemo(() => reviews
    .filter((review) => review.isActive)
    .sort((a, b) => b.rating - a.rating || new Date(b.date).getTime() - new Date(a.date).getTime()), [reviews]);
  const [form, setForm] = useState({ name: '', email: '', country: '', countryCode: '', tour: '', comment: '', rating: 5 });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const selectCountry = (countryCode: string) => {
    const selected = countries.find(([code]) => code === countryCode);
    setForm({ ...form, countryCode, country: selected ? selected[lang === 'es' ? 2 : 1] : '' });
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('request');
      setForm({ name: '', email: '', country: '', countryCode: '', tour: '', comment: '', rating: 5 });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  return (
    <section id="opiniones" className="guest-stories relative overflow-hidden py-24 text-white">
      <div className="guest-stories-orbit" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="guest-stories-header">
          <div>
            <span className="guest-stories-kicker"><MessageSquareText className="h-4 w-4" />{lang === 'es' ? 'Comentarios reales' : 'Real guest feedback'}</span>
            <h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">{lang === 'es' ? 'Historias compartidas por nuestros visitantes' : 'Stories shared by our guests'}</h2>
            <p className="mt-4 text-base">{lang === 'es' ? 'Todas las historias aprobadas aparecen juntas. Las experiencias con cinco estrellas se muestran primero.' : 'Every approved story appears together. Five-star experiences are shown first.'}</p>
          </div>
          <div className="guest-stories-summary"><strong>{activeReviews.length}</strong><span>{lang === 'es' ? 'historias publicadas' : 'published stories'}</span><div>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div></div>
        </div>

        <form onSubmit={submitReview} className="guest-review-form">
          <div className="guest-review-form-intro">
            <span>{lang === 'es' ? 'Comparte tu visita' : 'Share your visit'}</span>
            <h3>{lang === 'es' ? 'Cuéntanos cómo fue tu experiencia' : 'Tell us about your experience'}</h3>
            <p>{lang === 'es' ? 'Tu correo es privado y solo será utilizado para validar tu comentario.' : 'Your email stays private and is used only to validate your review.'}</p>
            <div className="guest-rating-input">{[1,2,3,4,5].map((value) => <button type="button" key={value} onClick={() => setForm({...form, rating: value})} aria-label={`${value} stars`}><Star className={`h-6 w-6 ${value <= form.rating ? 'is-selected' : ''}`} /></button>)}</div>
          </div>
          <div className="guest-review-fields">
            <label><span><UserRound className="h-3.5 w-3.5" />{lang === 'es' ? 'Nombre' : 'Name'}</span><input required value={form.name} onChange={(event) => setForm({...form, name: event.target.value})} placeholder={lang === 'es' ? 'Tu nombre completo' : 'Your full name'} /></label>
            <label><span><Mail className="h-3.5 w-3.5" />{lang === 'es' ? 'Correo privado' : 'Private email'}</span><input required type="email" value={form.email} onChange={(event) => setForm({...form, email: event.target.value})} placeholder="name@example.com" /></label>
            <label><span><Globe2 className="h-3.5 w-3.5" />{lang === 'es' ? 'País' : 'Country'}</span><div className="guest-country-field">{form.countryCode && <img src={flagUrl(form.countryCode)} alt="" width="24" height="18" />}<select required value={form.countryCode} onChange={(event) => selectCountry(event.target.value)}><option value="">{lang === 'es' ? 'Selecciona tu país' : 'Select your country'}</option>{countries.map(([code, en, es]) => <option key={code} value={code}>{lang === 'es' ? es : en}</option>)}</select></div></label>
            <label><span><MapPin className="h-3.5 w-3.5" />{lang === 'es' ? 'Experiencia realizada' : 'Experience visited'}</span><input value={form.tour} onChange={(event) => setForm({...form, tour: event.target.value})} placeholder={lang === 'es' ? 'Ej. Pirates Zipline Tour' : 'E.g. Pirates Zipline Tour'} /></label>
            <label className="guest-comment-field"><span><MessageSquareText className="h-3.5 w-3.5" />{lang === 'es' ? 'Tu historia' : 'Your story'}</span><textarea required minLength={10} rows={4} value={form.comment} onChange={(event) => setForm({...form, comment: event.target.value})} placeholder={lang === 'es' ? 'Cuéntanos cómo fue tu experiencia…' : 'Tell us about your experience…'} /></label>
            <div className="guest-review-submit">
              <div>{status === 'success' && <p className="is-success">{lang === 'es' ? 'Gracias. Tu historia fue enviada para revisión.' : 'Thank you. Your story was submitted for approval.'}</p>}{status === 'error' && <p className="is-error">{lang === 'es' ? 'No se pudo enviar. Inténtalo nuevamente.' : 'Could not submit. Please try again.'}</p>}</div>
              <button disabled={status === 'sending'}><Send className="h-4 w-4" />{status === 'sending' ? (lang === 'es' ? 'Enviando…' : 'Sending…') : (lang === 'es' ? 'Enviar historia' : 'Submit story')}</button>
            </div>
          </div>
        </form>

        {activeReviews.length > 0 ? (
          <div className="guest-review-grid">
            {activeReviews.map((review) => {
              const displayedCountryCode = review.countryCode || legacyCountryCode(review.location);
              return <article key={review.id} className="guest-review-card">
                <div className="guest-review-card-top"><div className="flex gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'is-filled' : ''}`} />)}</div><time>{new Date(review.date).toLocaleDateString(lang === 'es' ? 'es-HN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time></div>
                {review.tour && <span className="guest-review-tour">{review.tour}</span>}
                <blockquote>&ldquo;{review.comment[lang]}&rdquo;</blockquote>
                <footer>
                  <span className="guest-review-avatar">{review.name.charAt(0).toUpperCase()}</span>
                  <div><strong>{review.name}</strong><span className="guest-review-country">{displayedCountryCode && <img src={flagUrl(displayedCountryCode)} alt="" width="24" height="18" />}<span>{review.country || review.location}</span></span></div>
                  {review.isVerified && <span className="guest-verified"><CheckCircle2 className="h-3.5 w-3.5" />{lang === 'es' ? 'Verificada' : 'Verified'}</span>}
                </footer>
              </article>;
            })}
          </div>
        ) : (
          <div className="guest-stories-empty"><MessageSquareText className="h-10 w-10" /><h3>{lang === 'es' ? 'Sé el primero en compartir tu historia' : 'Be the first to share your story'}</h3><p>{lang === 'es' ? 'Los comentarios aprobados aparecerán aquí.' : 'Approved guest stories will appear here.'}</p></div>
        )}
      </div>
    </section>
  );
}
