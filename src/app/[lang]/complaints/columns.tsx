'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { Actions } from './actions';

export type Complaint = {
  id: string;
  status: string;
  courierId: number;
  courierFullName: string;
  userId: number;
  userFullName: string;
  deliveryDate: string;
  complaintDate: string;
};

export const columns: ColumnDef<Complaint>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue('status');
      return <Badge variant={value === 'pending' ? 'destructive' : 'default'}>{value === 'pending' ? 'En attente' : 'Résolu'}</Badge>;
    },
  },
  {
    accessorKey: 'courierFullName',
    header: 'Livreur',
    cell: ({ row }) => {
      if (!row.original.courierId) return 'Aucun livreur affecté';
      return <a href={`/users/${row.original.courierId}`}>{row.getValue('courierFullName')}</a>;
    },
  },
  {
    accessorKey: 'userFullName',
    header: 'Client',
    cell: ({ row }) => {
      return <a href={`/users/${row.original.userId}`}>{row.getValue('userFullName')}</a>;
    },
  },
  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date de livraison
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue('deliveryDate');
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    },
  },
  {
    accessorKey: 'complaintDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date de réclamation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue('complaintDate');
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Actions row={row} />,
  },
];
