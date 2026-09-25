import type { Metadata } from 'next';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL;
export const siteUrl = configuredUrl && /^https?:\/\//.test(configuredUrl) && !configuredUrl.includes('MY_APP_URL')
  ? configuredUrl.replace(/\/$/, '')
  : 'https://www.roatanpiratescanopy.com';

export const brandName = 'Roatan Pirates of the Caribbean Extreme Canopy Zipline';
export const defaultImage = '/image/homeweb.jpeg';

type SeoInput = { title: string; description: string; path: string; keywords?: string[] };

export function createMetadata({ title, description, path, keywords = [] }: SeoInput): Metadata {
  const canonical = `${siteUrl}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: 'website', locale: 'en_US', alternateLocale: ['es_HN'], url: canonical,
      siteName: brandName, title, description,
      images: [{ url: defaultImage, width: 1600, height: 1067, alt: 'Roatan clear boat and island adventure guests' }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [defaultImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
  };
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'LocalBusiness'],
  '@id': `${siteUrl}/#business`,
  name: brandName,
  alternateName: 'Pirates of the Caribbean Zipline Roatan',
  url: siteUrl,
  logo: `${siteUrl}/brand/pirates-logo.png`,
  image: `${siteUrl}${defaultImage}`,
  description: 'Extreme canopy zipline tours, clear boat adventures, reef snorkeling, animal parks and private shore excursions in Roatan, Honduras.',
  telephone: ['+50433877652', '+50499904937', '+50499922033'],
  email: 'info@roatanpiratescanopy.com',
  priceRange: '$35–$75 USD',
  currenciesAccepted: 'USD, HNL',
  paymentAccepted: 'Cash, credit card',
  address: { '@type': 'PostalAddress', addressLocality: 'Roatan', addressRegion: 'Bay Islands', addressCountry: 'HN' },
  areaServed: ['Roatan', 'Mahogany Bay', 'Coxen Hole', 'Bay Islands', 'Honduras'],
  availableLanguage: ['English', 'Spanish'],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '16:00' }
  ],
  sameAs: []
};

export const tourSchema = {
  '@context': 'https://schema.org', '@type': 'ItemList', name: 'Roatan tours and shore excursions',
  itemListElement: [
    ['Pirates Zipline Tour', 65], ['Animal Park Adventure', 35], ['Private Island Tour', 40],
    ['Clear Boat Adventure', 65], ['Glass Bottom Boat', 75], ['Private Island Beach Break', 45], ['Reef Snorkel Adventure', 50]
  ].map(([name, price], index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'TouristTrip', name, touristType: ['Cruise passengers','Families','Adventure travelers'], offers: { '@type': 'Offer', price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: `${siteUrl}/reservar` } } }))
};

export const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    ['Do I need zipline experience?', 'No prior experience is required. Professional guides provide instructions before the tour.'],
    ['What is the maximum weight?', 'The maximum weight is 370 lbs. Harnesses fit up to a 66-inch waist and 44-inch thighs.'],
    ['Can young children participate?', 'Children age 6 and under ride tandem with a parent or guide.'],
    ['Is transportation included?', 'Round-trip transportation is included with selected packages and can be coordinated from cruise ports, hotels and resorts.'],
    ['What should I bring?', 'Wear sportswear and secure shoes. Bring sunscreen, bug spray and a camera. Additional items depend on the selected water or beach activity.']
  ].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
};
