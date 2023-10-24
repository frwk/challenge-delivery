import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { NavigationMenuLink, navigationMenuTriggerStyle } from './ui/navigation-menu';

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

const MainNavLink = ({ href, children }: LinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <NextLink href={href} passHref legacyBehavior>
      <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive}>
        {children}
      </NavigationMenuLink>
    </NextLink>
  );
};

export default MainNavLink;
