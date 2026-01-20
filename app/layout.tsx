import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Load the default font (we use Syne in page.tsx, but this is for safety)
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SwagClub',
  description: 'The premier decentralized art platform on Base.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Providers wrapper handles the Web3 Wallet logic */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
