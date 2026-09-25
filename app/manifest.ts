import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Roatan Pirates of the Caribbean Extreme Canopy Zipline', short_name: 'Roatan Pirates',
    description: 'Zipline and island adventures in Roatan, Honduras.', start_url: '/', display: 'standalone',
    background_color: '#070b10', theme_color: '#0b1821',
    icons: [{ src: '/icon.png', sizes: 'any', type: 'image/png' }]
  };
}
