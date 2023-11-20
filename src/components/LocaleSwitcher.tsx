'use client';

import { locales, usePathname } from '@/navigation';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const LanguageSwitcher = () => {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFlagEmoji = useCallback((source_lang: string) => {
    if (source_lang === 'en') {
      return '🇬🇧';
    }
    return String.fromCodePoint(...[...source_lang.toUpperCase()].map(char => char.charCodeAt(0) + 127397));
  }, []);

  const [value, setValue] = useState({
    value: currentLocale,
    label: getFlagEmoji(currentLocale) ?? currentLocale,
  });

  const switchToLocale = useCallback(
    (locale: string) => {
      return router.push(`/${locale}${pathname}`, {
        searchParams,
      });
    },
    [router, pathname, searchParams],
  );

  const languageChanged = useCallback(
    async (locale: string) => {
      setValue({
        value: locale,
        label: getFlagEmoji(locale) ?? locale,
      });

      await switchToLocale(locale);
    },
    [switchToLocale, getFlagEmoji],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{value.label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(locale => {
          const label = getFlagEmoji(locale) ?? locale;

          return (
            <DropdownMenuItem key={locale} disabled={locale === currentLocale} onClick={() => languageChanged(locale)}>
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
