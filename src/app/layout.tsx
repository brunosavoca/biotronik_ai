import { ReactNode } from 'react';
import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}