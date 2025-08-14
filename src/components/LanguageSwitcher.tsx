"use client";

import { useParams, usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlagEmojis } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;

  const handleLocaleChange = (newLocale: string) => {
    // Get the current pathname without the locale
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    
    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {localeFlagEmojis[currentLocale as keyof typeof localeFlagEmojis]} {localeNames[currentLocale as keyof typeof localeNames]}
          </span>
          <span className="sm:hidden">
            {localeFlagEmojis[currentLocale as keyof typeof localeFlagEmojis]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`flex items-center gap-2 ${locale === currentLocale ? 'bg-accent' : ''}`}
          >
            <span>{localeFlagEmojis[locale]}</span>
            <span>{localeNames[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}