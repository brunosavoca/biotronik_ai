'use client';

import Link from 'next/link';
import { useCurrentLocale } from '@/hooks/useLocale';
import { ReactNode } from 'react';

interface LocaleLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export default function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const locale = useCurrentLocale();
  
  // If href already includes a locale or is external, don't modify it
  if (href.startsWith('http') || href.startsWith('//') || href.includes('[locale]')) {
    return <Link href={href} {...props}>{children}</Link>;
  }
  
  // Add locale to the href
  const localizedHref = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
  
  return <Link href={localizedHref} {...props}>{children}</Link>;
}