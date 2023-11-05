'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { Actions } from './actions';

export type Client = {
  id: string;
  userFullName: string;
  email: string;
  role: string;
  createdAt: string;
  deletedAt: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'userFullName',
    header: 'Nom complet',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const value: string = row.getValue('email');
      return <a href={`mailto:${value}`}>{value}</a>;
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Rôle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Inscrit le
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue('createdAt');
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    },
  },
  {
    accessorKey: 'deletedAt',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Supprimé le
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue('deletedAt');
      return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'Non supprimé';
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Actions row={row} />,
  },
];
