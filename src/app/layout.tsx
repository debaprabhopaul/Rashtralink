import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store-context';

export const metadata: Metadata = {
  title: 'Rashtralink — Sovereign Indian Social Platform',
  description:
    'Sovereign algorithmic feed curation with Priority Matrix and structured Bharat Voice consensus debates in the Charcha Arena.',
  keywords: [
    'Rashtralink',
    'Sovereign Indian Social',
    'Priority Matrix',
    'Charcha Arena',
    'Bharat Social Network',
    'Atmanirbhar Bharat',
  ],
  authors: [{ name: 'Rashtralink' }],
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#E85D04',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[#FDFBF7] dark:bg-[#081D34] text-[#081D34] dark:text-slate-100 transition-colors selection:bg-saffron selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
