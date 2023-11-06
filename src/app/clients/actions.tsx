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
import { Client } from './client-columns';
import { useToast } from '@/components/ui/use-toast';
import useSWRMutation from 'swr/mutation';

export function Actions({ row }: { row: Row<Client> }) {
  const client: Client = row.original;
  const router = useRouter();
  const { toast } = useToast();

  async function deleteClient(url: string) {
    await fetch(url, {
      method: 'DELETE',
    });
  }
  const { trigger: triggerDelete } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${client.id}`, deleteClient, {
    onSuccess: () => {
      router.push('/clients');
      toast({
        title: 'Client supprimé',
        description: 'Le client a bien été supprimé',
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
        <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}`)}>Voir l'utilisateur</DropdownMenuItem>
        {client.deletedAt === null ? <DropdownMenuItem onClick={() => triggerDelete()}>Supprimer le client</DropdownMenuItem> : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>Copier l&apos;ID du client</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
