import { ReactNode } from 'react';
import { locales } from '@/i18n';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}