import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define supported locales
export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale metadata for display
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português'
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});