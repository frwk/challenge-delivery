'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { Actions } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type User = {
  id: string;
  userFullName: string;
  email: string;
  role: string;
  createdAt: string;
  deletedAt: string;
};

export const columns: ColumnDef<User>[] = [
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
    header: ({ column }) => (
      <div className="flex">
        <Select
          onValueChange={value => {
            if (value === 'all') value = '';
            column.setFilterValue(value || undefined);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="courier">Livreur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableColumnFilter: true,
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
