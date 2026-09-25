'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Language } from '@/lib/types';

interface PageHeaderProps {
  lang: Language;
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PageHeader({
  lang,
  title,
  subtitle,
  badge,
  breadcrumbs
}: PageHeaderProps) {
  return (
    <div className="relative py-12 md:py-16 bg-[#090e15] border-b border-[#c5a059]/20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-nautical-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8c1d24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-[#ffd778] transition-colors">
            {lang === 'es' ? 'Inicio' : 'Home'}
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#ffd778] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#d4af37] font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#ffd778] text-xs font-semibold tracking-widest uppercase mb-3">
            {badge}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
