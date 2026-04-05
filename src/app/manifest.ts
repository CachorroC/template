import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Compendio Colombiano de hierbas medicinales',
    short_name: 'Compendio herbal colombiano',
    background_color: '#9ce39e',
    theme_color: '#286b33',
    prefer_related_applications: false,
    display: 'standalone',
    start_url: '/',
    //start_url                  : `https://${ process.env.BASE_URL ?? 'app.rsasesorjuridico.com' }`,
    description: 'Somos una firma legal comprometida con brindar something',
    display_override: ['standalone', 'minimal-ui'],
    shortcuts: [
      {
        name: 'Hierbas',
        url: '/hierbas',
        icons: [
          {
            src: '/icon.svg',
            sizes: '150x150',
            purpose: 'any',
          },
        ],
      },
    ],

    icons: [
      {
        src: '/icon.svg',
        sizes: '150x150',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: '150x150',
        purpose: 'monochrome',
      },
      {
        src: '/icon.svg',
        sizes: '150x150',
        purpose: 'any',
      },
      {
        src: '/icon1.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon1.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
