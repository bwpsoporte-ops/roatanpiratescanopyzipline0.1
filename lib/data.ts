import { TourPackage, PriceTier, GalleryItem, ReviewItem, FaqItem, SiteConfig } from './types';

export const initialSiteConfig: SiteConfig = {
  companyName: 'Pirates of the Caribbean Zipline',
  tagline: {
    es: 'No es solo un tour, es una aventura que recordarás para siempre.',
    en: 'It is not just a tour, it is an adventure you will remember forever.'
  },
  heroTitle: {
    es: 'Vive la aventura desde las alturas',
    en: 'Live the adventure from the heights'
  },
  heroSubtitle: {
    es: 'Atrévete a volar sobre la selva tropical y contempla las impresionantes vistas del Caribe desde una experiencia inolvidable en Roatán.',
    en: 'Dare to soar above the tropical rainforest and take in breathtaking Caribbean vistas in an unforgettable Roatán experience.'
  },
  heroSecondary: {
    es: 'Sé parte de la aventura. Vive la experiencia Pirates of the Caribbean Zipline.',
    en: 'Be part of the adventure. Live the Pirates of the Caribbean Zipline experience.'
  },
  phone: '+504 3387-7652',
  whatsapp: '+50433877652',
  email: 'info@roatanpiratescanopy.com',
  address: 'French Harbour, Main Island Highway',
  municipality: 'Roatán',
  department: 'Islas de la Bahía',
  country: 'Honduras',
  openingHours: {
    es: 'Domingo: solo reservaciones · Lunes–viernes: 8:00 AM–4:00 PM · Sábado: cerrado',
    en: 'Sunday: reservations only · Monday–Friday: 8:00 AM–4:00 PM · Saturday: closed'
  },
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tripadvisorUrl: 'https://tripadvisor.com',
  googleMapsUrl: 'https://maps.google.com/?q=Pirates+of+the+Caribbean+Zipline+Roatan',
  cruisePortNotes: {
    es: 'Garantía de retorno a tiempo al barco. Recogemos directamente en la salida de Mahogany Bay y Coxen Hole.',
    en: 'Guaranteed on-time return to ship. Direct pickup outside Mahogany Bay & Coxen Hole cruise ports.'
  }
};

export const initialTours: TourPackage[] = [
  {
    id: 'canopy-extrem-classic',
    name: {
      es: 'Circuito Extremo Clásico Pirates',
      en: 'Pirates Extreme Classic Canopy Circuit'
    },
    subtitle: {
      es: 'El recorrido emblemático de tirolesas con vistas de costa a costa',
      en: 'The flagship zipline course with panoramic coast-to-coast ocean views'
    },
    description: {
      es: 'Vuela a través de la densa selva virgen de Roatán en 9 emocionantes tirolesas de doble cable y 14 plataformas panorámicas suspendidas en las copas de los árboles, con vistas al arrecife de coral del Caribe.',
      en: 'Fly through Roatán’s virgin rainforest across 9 thrilling double-cable ziplines and 14 scenic treetop platforms with breathtaking views of the Mesoamerican Caribbean barrier reef.'
    },
    highlightBadge: {
      es: 'Más Popular',
      en: 'Most Popular'
    },
    imageUrl: '/image/homeweb.jpeg',
    stats: {
      ziplines: 9,
      platforms: 14,
      maxHeight: '320 ft (98 m)',
      totalLength: '2.0 millas (3.2 km)',
      duration: '1.5 – 2 Horas',
      difficulty: {
        es: 'Moderado (Apto para toda la familia)',
        en: 'Moderate (Suitable for all ages 5+)'
      }
    },
    features: {
      es: [
        'Sistema de seguridad de doble cable de acero certificado',
        'Vistas panorámicas de 360 grados hacia ambos lados de la isla',
        'Guías locales bilingües certificados por cable y plataforma',
        'Equipamiento Petzl profesional de grado internacional',
        'Orientación previa completa en pista de práctica',
        'Casilleros seguros para pertenencias'
      ],
      en: [
        'Certified dual-cable redundant steel security system',
        '360-degree panoramic ocean views across both island coastlines',
        'Certified bilingual local guides assisting on every platform',
        'International commercial grade Petzl safety harnesses & helmets',
        'Complete pre-flight orientation & ground practice run',
        'Secure lockers for small valuables'
      ]
    },
    priceAdult: 65,
    priceChild: 45,
    currency: 'USD',
    isAvailable: true
  },
  {
    id: 'zipline-eco-sanctuary',
    name: {
      es: 'Combo Pirates Zipline + Santuario Animal',
      en: 'Pirates Zipline + Animal Sanctuary Combo'
    },
    subtitle: {
      es: 'Tirolesas extremas + interacción con perezosos, monos capuchinos y guacamayas',
      en: 'Extreme zipline canopy + intimate encounter with sloths, capuchin monkeys & macaws'
    },
    description: {
      es: 'La experiencia completa de Roatán: todo el circuito de 9 tirolesas extremas más una visita guiada para abrazar perezosos rescatados, alimentar simpáticos monos cariblancos y tomarte fotos con aves tropicales.',
      en: 'The quintessential Roatán adventure: the complete 9-zipline extreme canopy circuit paired with a guided encounter to hold rescued sloths, interact with friendly monkeys, and snap memories with native macaws.'
    },
    highlightBadge: {
      es: 'Especial Cruceros',
      en: 'Cruise Favorite'
    },
    imageUrl: '/image/WhatsApp%20Image%202026-09-21%20at%208.25.05%20PM.jpeg',
    stats: {
      ziplines: 9,
      platforms: 14,
      maxHeight: '320 ft (98 m)',
      totalLength: '2.0 millas (3.2 km)',
      duration: '3.0 – 3.5 Horas',
      difficulty: {
        es: 'Fácil - Moderado',
        en: 'Easy - Moderate'
      }
    },
    features: {
      es: [
        'Circuito completo de 9 tirolesas y 14 plataformas',
        'Interacción guiada y fotos con osos perezosos rescatados',
        'Encuentro y juegos con monos capuchinos en ambiente natural',
        'Guías especialistas en naturaleza y seguridad',
        'Transporte coordinado dentro del complejo eco-turístico',
        'Tiempo libre para relajarse en el mirador pirata'
      ],
      en: [
        'Full 9-zipline and 14-platform extreme canopy course',
        'Personal encounter and photo session holding rescued sloths',
        'Playful interaction with white-faced capuchin monkeys',
        'Specialized nature & safety guides throughout the tour',
        'Coordinated internal eco-park transportation',
        'Free time to unwind at the Caribbean pirate viewpoint'
      ]
    },
    priceAdult: 85,
    priceChild: 65,
    currency: 'USD',
    isAvailable: true
  }
];

export const initialPrices: PriceTier[] = [
  {
    id: 'adults',
    title: {
      es: 'Adultos',
      en: 'Adults'
    },
    ageRange: {
      es: '13 años en adelante',
      en: 'Ages 13 and older'
    },
    price: 65,
    currency: 'USD',
    included: {
      es: [
        'Recorrido de 9 tirolesas y 14 plataformas',
        'Arnés, casco, guantes y equipo Petzl profesional',
        'Guías bilingües certificados dedicados',
        'Uso de casilleros de seguridad',
        'Agua purificada durante el recorrido'
      ],
      en: [
        'Full course: 9 ziplines and 14 scenic platforms',
        'Pro Petzl harness, helmet, gloves & safety gear',
        'Dedicated certified bilingual safety guides',
        'Complimentary secure personal locker',
        'Purified drinking water stations'
      ]
    },
    conditions: {
      es: 'Peso máximo 370 lbs. Menores de 6 años viajan en tándem con un padre o guía.',
      en: 'Max weight 370 lbs. Ages 6 and under ride tandem with a parent or guide.'
    }
  },
  {
    id: 'children',
    title: {
      es: 'Niños',
      en: 'Children'
    },
    ageRange: {
      es: '5 a 12 años',
      en: 'Ages 5 to 12'
    },
    price: 45,
    currency: 'USD',
    included: {
      es: [
        'Recorrido completo adaptado con opción de tandem (con guía)',
        'Arneses infantiles certificados de máxima seguridad',
        'Acompañamiento personal continuo de guía experto',
        'Diploma de aventurero pirata al finalizar',
        'Casilleros y agua purificada'
      ],
      en: [
        'Full course with optional tandem ride with guide',
        'Certified high-security pediatric harnesses & gear',
        'Hands-on guidance by certified adventure guides',
        'Pirate Adventure Certificate upon completion',
        'Lockers & fresh purified water'
      ]
    },
    conditions: {
      es: 'Deben estar acompañados por un adulto responsable.',
      en: 'Must be accompanied by a responsible adult.'
    }
  },
  {
    id: 'cruise-vip',
    title: {
      es: 'Pasajeros de Crucero VIP',
      en: 'Cruise Passenger VIP Shore Excursion'
    },
    ageRange: {
      es: 'Carnival, Royal Caribbean, NCL, MSC, etc.',
      en: 'Carnival, Royal Caribbean, NCL, MSC & all lines'
    },
    price: 75,
    currency: 'USD',
    tag: {
      es: 'Más Reservado',
      en: 'Best Seller'
    },
    isPopular: true,
    included: {
      es: [
        'Transporte privado ida y vuelta desde Mahogany Bay o Coxen Hole',
        'Garantía absoluta de retorno a tiempo a su barco',
        'Circuito completo de tirolesas extremas',
        'Prioridad de acceso al llegar para evitar filas',
        'Guías bilingües con amplia experiencia con cruceristas',
        'Casillero y agua de bienvenida'
      ],
      en: [
        'Round-trip private transit from Mahogany Bay or Coxen Hole',
        '100% Guaranteed on-time return to your cruise ship',
        'Complete 9-cable extreme zipline circuit',
        'Priority fast-track check-in upon arrival',
        'Experienced bilingual guides attuned to ship times',
        'Secure locker & fresh welcome hydration'
      ]
    },
    conditions: {
      es: 'Sincronizado con la hora de su barco. Flexibilidad ante demoras de atraque.',
      en: 'Synchronized with your ship time. Free re-scheduling if ship is delayed.'
    }
  },
  {
    id: 'groups',
    title: {
      es: 'Grupos y Familias',
      en: 'Groups & Large Families'
    },
    ageRange: {
      es: '10 personas o más',
      en: '10 people or more'
    },
    price: 55,
    currency: 'USD',
    included: {
      es: [
        'Precio especial con descuento por volumen',
        'Guía exclusivo asignado solo para su grupo',
        'Fotos de grupo en plataforma panorámica',
        'Flexibilidad en horario de salida personalizada',
        'Todas las 9 tirolesas y equipo de seguridad'
      ],
      en: [
        'Special discounted rate for 10+ explorers',
        'Private dedicated guide assigned solely to your party',
        'Group commemorative photo on the sky platform',
        'Custom flexible start time to fit group agenda',
        'All 9 zip cables & international safety gear'
      ]
    },
    conditions: {
      es: 'Aplica a partir de 10 participantes con reserva previa.',
      en: 'Applies to parties of 10 or more booked in advance.'
    }
  }
];

const localGalleryFiles = [
  'homeweb.jpeg',
  ...['1', '2', '3'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.02 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.03 PM.jpeg',
  ...['1', '2'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.03 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.04 PM.jpeg',
  ...['1', '2'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.04 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.05 PM.jpeg',
  ...['1', '2', '3', '4'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.05 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.06 PM.jpeg',
  ...['1', '2', '3'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.06 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.07 PM.jpeg',
  ...['1', '2', '3', '4'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.07 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.08 PM.jpeg',
  ...['1', '2', '3', '4'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.08 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.09 PM.jpeg',
  ...['1', '2', '3', '4'].map((n) => `WhatsApp Image 2026-09-21 at 8.25.09 PM (${n}).jpeg`),
  'WhatsApp Image 2026-09-21 at 8.25.10 PM.jpeg'
];

export const initialGallery: GalleryItem[] = [
  ...localGalleryFiles.map((filename, index): GalleryItem => ({
    id: `local-gallery-${index + 1}`,
    title: {
      es: index === 0 ? 'Aventura en bote transparente en Roatán' : `Experiencia auténtica en Roatán · ${index + 1}`,
      en: index === 0 ? 'Clear boat adventure in Roatan' : `Authentic Roatan experience · ${index + 1}`
    },
    category: index < 10 ? 'paisajes' : index < 23 ? 'visitantes' : 'instalaciones',
    imageUrl: `/image/${encodeURIComponent(filename)}`,
    isFeatured: index < 12,
    type: 'image'
  })),
  {
    id: 'local-gallery-video',
    title: { es: 'Aventura en movimiento por Roatán', en: 'Roatan adventure in motion' },
    category: 'videos',
    imageUrl: '/image/homeweb.jpeg',
    videoUrl: '/image/WhatsApp%20Video%202026-09-21%20at%208.25.04%20PM.mp4',
    isFeatured: true,
    type: 'video'
  }
];

export const initialReviews: ReviewItem[] = [];

export const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: {
      es: '¿Necesito experiencia previa para hacer la tirolesa?',
      en: 'Do I need prior ziplining experience?'
    },
    answer: {
      es: 'No, no se requiere ninguna experiencia. Antes de iniciar el recorrido, nuestros guías certificados le brindarán una orientación completa de seguridad y una práctica en una pista de prueba a nivel del suelo.',
      en: 'No prior experience is needed at all! Before starting, our certified guides give you a thorough safety briefing and a hands-on ground-level practice demonstration.'
    }
  },
  {
    id: 'faq-2',
    question: {
      es: '¿Pueden participar niños?',
      en: 'Can children participate?'
    },
    answer: {
      es: 'Sí, recibimos niños desde los 5 años de edad. Contamos con arneses y cascos pediátricos especiales. Los niños más pequeños o tímidos pueden realizar los vuelos en tándem sujetos junto a uno de nuestros guías certificados.',
      en: 'Yes! Children aged 5 and older are warmly welcomed. We provide pediatric-certified harnesses and helmets. Smaller or cautious kids can fly tandem attached directly to a professional guide.'
    }
  },
  {
    id: 'faq-3',
    question: {
      es: '¿Cuál es el peso máximo y mínimo permitido?',
      en: 'What are the minimum and maximum weight limits?'
    },
    answer: {
      es: 'El límite máximo de peso es 370 lbs. Los arneses se ajustan hasta 66 pulgadas de cintura y 44 pulgadas de muslo.',
      en: 'The maximum weight limit is 370 lbs. Harnesses fit up to a 66-inch waist and 44-inch thighs.'
    }
  },
  {
    id: 'faq-4',
    question: {
      es: '¿Qué tipo de ropa y calzado debo utilizar?',
      en: 'What clothing and footwear should I wear?'
    },
    answer: {
      es: 'Recomendamos ropa cómoda deportiva (bermudas, shorts largos o pantalones ligeros) y calzado cerrado (tenis o botas de senderismo). No se permiten sandalias sin correa ni chanclas descalzas por seguridad.',
      en: 'We recommend comfortable sporty attire (shorts, bermudas, or athletic pants) and closed-toe footwear (sneakers or hiking shoes). Flip-flops and loose slip-on sandals are prohibited for safety.'
    }
  },
  {
    id: 'faq-5',
    question: {
      es: '¿Debo usar zapatos cerrados obligatoriamente?',
      en: 'Are closed-toe shoes mandatory?'
    },
    answer: {
      es: 'Sí, el calzado cerrado es indispensable para proteger sus pies al despegar y aterrizar en las plataformas de madera. Si olvidó sus tenis, disponemos de calzado protector seguro para préstamo o alquiler.',
      en: 'Yes, closed-toe footwear is mandatory to ensure foot safety during takeoffs and landings on the wooden tree platforms. We have sanitized rental shoes available if needed.'
    }
  },
  {
    id: 'faq-6',
    question: {
      es: '¿Qué sucede si llueve el día de mi reserva?',
      en: 'What happens if it rains on my tour day?'
    },
    answer: {
      es: 'La tirolesa opera perfectamente con lluvia tropical cálida; de hecho, volar entre la neblina selvática es una experiencia mágica. Solo se suspende temporalmente en caso de tormenta eléctrica extrema.',
      en: 'Our ziplines operate smoothly and safely in warm tropical rain; soaring through the jungle mist is a bucket-list memory. Tours only pause in the rare event of severe lightning storms.'
    }
  },
  {
    id: 'faq-7',
    question: {
      es: '¿Puedo llevar mi teléfono celular o cámara GoPro?',
      en: 'Can I bring my smartphone or GoPro camera?'
    },
    answer: {
      es: 'Sí, siempre y cuando estén sujetos con correas seguras o monturas para el casco/pecho. También ofrecemos casilleros gratuitos para resguardar mochilas y objetos de valor.',
      en: 'Yes, provided they are securely tethered with lanyards or mounted to helmets/chests. We also supply free secure lockers to store bags, sunglasses, and loose valuables.'
    }
  },
  {
    id: 'faq-8',
    question: {
      es: '¿Cuánto dura la experiencia en total?',
      en: 'How long does the entire experience last?'
    },
    answer: {
      es: 'El circuito de tirolesas toma aproximadamente entre 1.5 y 2 horas. Si contrata el paquete combinado con transporte desde el puerto o santuario animal, la excursión completa dura entre 3 y 3.5 horas.',
      en: 'The canopy zipline circuit takes approximately 1.5 to 2 hours. If you choose the combo excursion including cruise port transit and animal sanctuary, allocate 3 to 3.5 hours total.'
    }
  },
  {
    id: 'faq-9',
    question: {
      es: '¿El transporte está incluido en mi reserva?',
      en: 'Is round-trip transportation included?'
    },
    answer: {
      es: 'El paquete de crucero VIP y reservas con opción de transporte incluyen traslado privado ida y vuelta desde Mahogany Bay, Coxen Hole o los principales hoteles de la isla.',
      en: 'Our Cruise VIP packages and reservations with transit option include private round-trip transport directly from Mahogany Bay, Coxen Hole, or major island resorts.'
    }
  },
  {
    id: 'faq-10',
    question: {
      es: '¿Recogen a pasajeros de cruceros y garantizan el regreso a tiempo?',
      en: 'Do you pick up cruise passengers and guarantee on-time return to the ship?'
    },
    answer: {
      es: '¡Absolutamente! Más del 70% de nuestros visitantes provienen de cruceros (Carnival, Royal Caribbean, NCL, etc.). Nuestro equipo monitorea las horas del barco y garantizamos su regreso al puerto al menos 2 horas antes de zarpar.',
      en: 'Absolutely! Over 70% of our adventurers arrive via cruise ships. We monitor local ship times and guarantee your return to the port security gates at least 2 hours before ship departure.'
    }
  },
  {
    id: 'faq-11',
    question: {
      es: '¿Puedo reservar para un grupo grande o familia numerosa?',
      en: 'Can I book for a large group or family reunion?'
    },
    answer: {
      es: 'Sí, disponemos de tarifas especiales para grupos de 10 personas o más con guías exclusivos dedicados. Indique el tamaño de su grupo en el formulario para aplicar el descuento automático.',
      en: 'Yes! We offer discounted group pricing for parties of 10 or more, complete with dedicated private guides. Simply enter your group count on our booking form to apply preferential rates.'
    }
  },
  {
    id: 'faq-12',
    question: {
      es: '¿Cómo confirmo mi reservación?',
      en: 'How do I confirm my reservation?'
    },
    answer: {
      es: 'Al enviar el formulario recibirá de inmediato su código de reserva. Nuestro equipo de atención le enviará una confirmación oficial por WhatsApp y correo electrónico con las instrucciones de encuentro.',
      en: 'Upon submitting the form you will instantly receive your booking reference code. Our operations team will send your official confirmation via WhatsApp and email with exact meeting directions.'
    }
  },
  {
    id: 'faq-13',
    question: {
      es: '¿Qué métodos de pago aceptan?',
      en: 'What payment methods do you accept?'
    },
    answer: {
      es: 'Aceptamos dólares estadounidenses (USD en efectivo), Lempiras hondureñas (HNL), tarjetas de crédito y débito (Visa, Mastercard, Amex), y depósitos por transferencia bancaria.',
      en: 'We accept US Dollars cash, Honduran Lempiras (HNL), all major credit and debit cards (Visa, Mastercard, Amex), and online pre-payment.'
    }
  },
  {
    id: 'faq-14',
    question: {
      es: '¿Cuál es la política de cancelación o cambios?',
      en: 'What is your cancellation and refund policy?'
    },
    answer: {
      es: 'Cancelaciones con más de 24 horas de anticipación tienen reembolso del 100%. Para pasajeros de crucero, si su barco no atraca en Roatán por razones climáticas o cancela el puerto, su reserva se cancela sin costo ni penalidad.',
      en: 'Cancellations made at least 24 hours in advance receive a 100% full refund. For cruise ship passengers: if your ship misses Roatán due to weather or itinerary shifts, you receive a full zero-penalty cancellation.'
    }
  }
];
