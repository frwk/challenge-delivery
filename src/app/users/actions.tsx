'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { User } from './user-columns';
import { useToast } from '@/components/ui/use-toast';
import useSWRMutation from 'swr/mutation';

export function Actions({ row }: { row: Row<User> }) {
  const user: User = row.original;
  const router = useRouter();
  const { toast } = useToast();

  async function deleteClient(url: string) {
    await fetch(url, {
      method: 'DELETE',
    });
  }
  const { trigger: triggerDelete } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, deleteClient, {
    onSuccess: () => {
      router.push('/users');
      toast({
        title: 'Utilisateur supprimé',
        description: "L'utilisateur a été supprimé avec succès",
      });
    },
    revalidate: false,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>Voir l&apos;utilisateur</DropdownMenuItem>
        {user.deletedAt === null ? <DropdownMenuItem onClick={() => triggerDelete()}>Supprimer l&apos;utilisateur</DropdownMenuItem> : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copier l&apos;ID de l&apos;utilisateur</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
