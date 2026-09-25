import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { AppShell } from '@/components/AppShell';
import { brandName, createMetadata, faqSchema, localBusinessSchema, siteUrl, tourSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...createMetadata({ title: 'Roatan Zipline & Shore Excursions | Pirates of the Caribbean', description: 'Book top-rated Roatan zipline, clear boat, snorkeling, animal park and private island tours with bilingual guides and round-trip transportation.', path: '/', keywords: ['Roatan Honduras','Roatan zipline','Roatan canopy','Roatan shore excursions','things to do in Roatan','tourism Roatan','canopy Roatan Honduras','excursiones Roatan'] }),
  alternates: { canonical: siteUrl, languages: { 'en': siteUrl, 'es': `${siteUrl}/es`, 'x-default': siteUrl } },
  applicationName: brandName,
  category: 'travel',
  authors: [{ name: brandName }],
  creator: brandName,
  publisher: brandName,
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { email: false, address: false, telephone: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
