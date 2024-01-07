'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { DELIVERIES_STATUSES_MAPPING } from '@/lib/utils';
import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Actions } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Delivery = {
  id: string;
  status: string;
  userId: number;
  userFullName: string;
  courierId: number;
  courierFullName: string;
  notation: number | null;
  confirmationCode: string;
  dropoffAddress: string;
  dropoffDate: string;
  createdAt: string;
};

export const columns: ColumnDef<Delivery>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className="flex">
        <Select
          onValueChange={value => {
            if (value === 'all') value = '';
            column.setFilterValue(value || undefined);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="accepted">Confirmé</SelectItem>
            <SelectItem value="picked_up">En cours de livraison</SelectItem>
            <SelectItem value="delivered">Livré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableColumnFilter: true,
    cell: ({ row }) => {
      const VARIANT_MAPPING: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
        [DeliveriesStatusesEnum.DELIVERED]: 'default',
        [DeliveriesStatusesEnum.PENDING]: 'outline',
        [DeliveriesStatusesEnum.PICKED_UP]: 'secondary',
        [DeliveriesStatusesEnum.CANCELLED]: 'destructive',
      };
      const value: string = row.getValue('status');
      const status = DELIVERIES_STATUSES_MAPPING[value];
      return <Badge variant={VARIANT_MAPPING[value]}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'notation',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Notation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (!row.getValue('notation')) return 'Aucune notation';
      return <Slider defaultValue={row.getValue('notation')} max={5} value={[+(row.getValue('notation') as number)]} disabled />;
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
    accessorKey: 'courierFullName',
    header: 'Livreur',
    cell: ({ row }) => {
      if (!row.original.courierId) return 'Aucun livreur affecté';
      return <a href={`/users/${row.original.courierId}`}>{row.getValue('courierFullName')}</a>;
    },
  },
  {
    accessorKey: 'pickupAddress',
    header: 'Adresse de collecte',
    cell: ({ row }) => {
      const { lon, lat }: { lon: number; lat: number } = row.getValue('pickupAddress');
      return (
        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noreferrer">
          Ouvrir Maps
        </a>
      );
    },
  },
  {
    accessorKey: 'dropoffAddress',
    header: 'Adresse de livraison',
    cell: ({ row }) => {
      const { lon, lat }: { lon: number; lat: number } = row.getValue('dropoffAddress');
      return (
        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noreferrer">
          Ouvrir Maps
        </a>
      );
    },
  },
  {
    accessorKey: 'dropoffDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Livré le
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (!row.getValue('dropoffDate')) return 'Non livré';
      const value: string = row.getValue('dropoffDate');
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Commande passée le
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
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Actions row={row} />,
  },
];
