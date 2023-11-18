import MainNavLink from '@/components/MainNavLink';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';
import { useTranslations } from 'next-intl';

export function MainNav({ ...props }) {
  const t = useTranslations('MainNav');

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className={props.orientation === 'vertical' ? 'flex-col' : ''}>
        <NavigationMenuItem>
          <MainNavLink href="/">{t('dashboard')}</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/map">{t('map')}</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/deliveries">{t('deliveries')}</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/users">{t('users')}</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/complaints">{t('complaints')}</MainNavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
