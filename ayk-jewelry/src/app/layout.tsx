import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AYK Accessorize With Yvon & Knottycraft Shop — Handmade Crochet & Jewelry Ghana',
  description: 'Discover beautifully handcrafted crochet pieces and unique jewelry from AYK Accessorize With Yvon & Knottycraft. Shop handmade bags, clothing, accessories, rings, necklaces and more. Crafted with care in Ghana.',
  keywords: 'crochet Ghana, handmade crochet, crochet bags, crochet clothing, handmade jewelry Ghana, rings, necklaces, bracelets',
  openGraph: {
    title: 'AYK Accessorize With Yvon & Knottycraft Shop',
    description: 'Handcrafted crochet creations and unique jewelry made with love in Ghana.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
