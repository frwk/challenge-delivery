import MainNavLink from '@/components/MainNavLink';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';

export function MainNav({ ...props }) {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <MainNavLink href="/">Dashboard</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/map">Carte</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/deliveries">Livraisons</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/couriers">Coursiers</MainNavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MainNavLink href="/complaints">Réclamations</MainNavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
