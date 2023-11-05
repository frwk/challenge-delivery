'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Client, columns } from './client-columns';
import { DataTable } from '../data-table';
import { User } from '@/types/user';

export default function Clients() {
  const [clientData, setClientData] = useState<Client[]>([]);
  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users`, url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data) {
      const clients: Client[] = data.map((client: User) => {
        return {
          id: client.id,
          userFullName: `${client.firstName} ${client.lastName}`,
          email: client.email,
          role: client.role.charAt(0).toUpperCase() + client.role.slice(1),
          createdAt: client.createdAt,
          deletedAt: client.deletedAt,
        };
      });
      setClientData(clients);
    }

    return () => {
      setClientData([]);
    };
  }, [data]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
      </div>
      <div>{error ? <div>Erreur lors du chargement des données</div> : <DataTable columns={columns} data={clientData} isLoading={isLoading} />}</div>
    </div>
  );
}
