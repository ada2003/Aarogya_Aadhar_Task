import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarogya Aadhar - Customer Review System',
  description: 'Customer review management system for snack products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}