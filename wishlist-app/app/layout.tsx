import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lista wyprawkowa 🌸',
  description: 'Nasza lista wyprawkowa — zarezerwuj prezent dla naszego maluszka',
  openGraph: {
    title: 'Lista wyprawkowa 🌸',
    description: 'Zarezerwuj prezent dla naszego maluszka',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
