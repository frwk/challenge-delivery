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
import { Delivery } from './deliveries-columns';

export function Actions({ row }: { row: Row<Delivery> }) {
  const delivery: Delivery = row.original;
  const router = useRouter();

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
        <DropdownMenuItem onClick={() => router.push(`/deliveries/${delivery.id}`)}>Ouvrir la commande</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(delivery.id)}>Copier l&apos;ID de la commande</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
