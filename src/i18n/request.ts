import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  const finalLocale = locale || defaultLocale;
  
  return {
    locale: finalLocale,
    messages: (await import(`@/messages/${finalLocale}.json`)).default
  };
});