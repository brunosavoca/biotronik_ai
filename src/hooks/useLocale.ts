'use client';

import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  
  // Validate and return default if invalid
  if (locales.includes(locale)) {
    return locale;
  }
  
  return 'en'; // default locale
}