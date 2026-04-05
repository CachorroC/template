import './manifest';
import 'styles/globals.css';
import 'material-symbols';
import { ReactNode, Suspense } from 'react';
import { Metadata, Viewport } from 'next';
import { josefina,
  playDisp,
  ptserif,
  radio,
  raleway, lora } from '#@/lib/styles/fonts';
import { Loader } from '#@/lib/components/Loader/loader';
import PushManagerComponent from '#@/lib/components/PushManager';
import { ModalProvider } from './context/ModalContext';
import { NavigationContextProvider } from './context/navigation-context';
import { PushNotificationProvider } from './context/pushNotificationContext';
import { SearchProvider } from './context/search-context';
import layout from '#@/lib/styles/layout.module.css';
import { NavBar } from '#@/lib/components/layout/NavBar';
import { CssBaseline,
  InitColorSchemeScript,
  ThemeProvider, } from '@mui/material';
// This is MUI's official SSR cache provider for Next.js App Router
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from './theme';
import { MainLoader } from '#@/lib/components/Loader/main-loader';

const hostname
  = process.env.NODE_ENV === 'production'
    ? 'https://colombia-medicinal.suarez-ramirez.com'
    : 'https://beta.rsasesorjuridico.com';

export const metadata: Metadata = {
  metadataBase: new URL(
    hostname
  ),
  title: 'Vademecum y compendio Colombiano',
  description:
    'Una recopilación herbal orientada a la producción de saber sobre plantas medicinales ancestrales de Colombia.',
  applicationName: 'Compendio Colombiano de hierbas medicinales',
  referrer       : 'origin-when-cross-origin',
  keywords       : [
    'Vademecum',
    'compendio',
    'Colombia',
    'Vademecum Colombiano',
    'Hierbas Nativas de Colombia',
  ],
  authors: [
    {
      name: 'Luis Enrique Rodriguez',
    },
    {
      name: 'Juan Camilo Suárez',
    },
    {
      name: 'Marlon Ochoa',
    },
  ],

  creator        : 'Juan Camilo Suárez',
  publisher      : 'Rodriguez, Ochoa y Suárez',
  alternates     : {},
  formatDetection: {
    email    : false,
    address  : false,
    telephone: false,
  },
  appleWebApp: {
    capable       : true,
    title         : 'Compendio Colombiano de hierbas medicinales',
    statusBarStyle: 'black-translucent',
    startupImage  : [
      '/icon.svg',
      {
        url  : '/icon.svg',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  appLinks: {
    web: {
      url            : '/',
      should_fallback: true,
    },
  },
};

export const viewport: Viewport = {
  width            : 'device-width',
  initialScale     : 1,
  maximumScale     : 1,
  colorScheme      : 'light dark',
  interactiveWidget: 'resizes-content',
  themeColor       : [
    {
      media: '(prefers-color-scheme: light)',
      color: '#81C784',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#2E7D32',
    },
  ],
};

export default function RootLayout(
  {
    children,
    modal,
  }: {
    children: ReactNode;
    modal   : ReactNode;
  }
) {
  return (
    <html
      lang="es-CO"
      suppressHydrationWarning
    >
      <body
        className={`${ playDisp.variable } ${ josefina.variable } ${ raleway.variable } ${ radio.variable } ${ ptserif.variable } ${ lora.variable } [ color-scheme: light dark ]`}
      >
        <AppRouterCacheProvider>
          <InitColorSchemeScript
            attribute="data"
            defaultMode="system"
          />

          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<MainLoader />}>
              <SearchProvider>
                <PushNotificationProvider>
                  <NavigationContextProvider>
                    <SearchProvider>
                      <ModalProvider>
                        <PushManagerComponent />
                        <div className={layout.container}>
                          <Suspense
                            fallback={
                              <nav>
                                Cargando menú... <Loader />
                              </nav>
                            }
                          >
                            <NavBar />
                          </Suspense>
                          {children}
                          {modal}
                        </div>
                      </ModalProvider>
                    </SearchProvider>
                  </NavigationContextProvider>
                </PushNotificationProvider>
              </SearchProvider>
            </Suspense>
          </ThemeProvider>

          {/*  <Script
          src={`https://${ prefix }.rsasesorjuridico.com/install-service-worker.js`}
        /> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
