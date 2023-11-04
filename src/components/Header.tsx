import { useState } from 'react';
import { IconMenu2 } from '@tabler/icons-react';
import { ThemeToggle } from './ThemeToggle';
import { UserNav } from './UserNav';
import { MainNav } from './MainNav';
import { useAuth } from '@/context/authContext';

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  return (
    <>
      <div className="border-b">
        <div className="items-center gap-4 p-4 flex">
          <IconMenu2 size={24} onClick={() => setOpen(!open)} className="sm:hidden" />
          <MainNav className="hidden sm:block" />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
        <div className="flex justify-center">
          <MainNav orientation="vertical" className={open ? 'flex sm:hidden' : 'hidden'} />
        </div>
      </div>
    </>
  );
}
