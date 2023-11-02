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
import useSWRMutation from 'swr/mutation';
import { Complaint } from './columns';

export function Actions({ row }: { row: Row<Complaint> }) {
  const complaint: Complaint = row.original;
  const router = useRouter();

  async function updateComplaint(url: string, { arg }: { arg: string }) {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ status: arg }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const { trigger } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/complaints/${row.getValue('id')}`, updateComplaint);

  const markAsResolved = async () => {
    trigger('resolved');
  };

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
        <DropdownMenuItem onClick={() => router.push(`/complaints/${complaint.id}`)}>Ouvrir la réclamation</DropdownMenuItem>
        {complaint.status === 'pending' && <DropdownMenuItem onClick={markAsResolved}>Marquer comme résolu</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(complaint.id)}>Copier l&apos;ID de la réclamation</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
