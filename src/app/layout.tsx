import './globals.css';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import AdBanner from '@/components/AdBanner';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { CompareProvider } from '@/context/CompareContext';
import CompareBar from '@/components/CompareBar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export const metadata: Metadata = {
  title: {
    default: 'TechNova — Premium Tech Marketplace',
    template: '%s | TechNova',
  },
  description: 'Discover the latest smartphones, laptops, TVs and accessories at TechNova. Best prices, verified sellers, fast delivery.',
  keywords: ['marketplace', 'electronics', 'smartphones', 'laptops', 'TVs', 'tech'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TechNova',
  },
  openGraph: {
    title: 'TechNova — Premium Tech Marketplace',
    description: 'Discover the latest smartphones, laptops, TVs and accessories.',
    type: 'website',
    locale: 'en_US',
    siteName: 'TechNova',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechNova — Premium Tech Marketplace',
    description: 'Discover the latest smartphones, laptops, TVs and accessories.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                  <CompareProvider>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                      <Header />
                      <AdBanner />
                      <main style={{ flex: 1, padding: '2rem 0' }}>
                        {children}
                      </main>
                      <Footer />
                    </div>
                    <ChatWidget />
                    <CompareBar />
                    <ScrollToTop />
                  </CompareProvider>
                </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
