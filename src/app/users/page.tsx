'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { User, columns } from './user-columns';
import { DataTable } from '../data-table';
import { User as DBUser } from '@/types/user';

export default function Users() {
  const [usersData, setUserData] = useState<User[]>([]);
  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users`, url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data) {
      const users: User[] = data.map((user: DBUser) => {
        return {
          id: user.id,
          userFullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          createdAt: user.createdAt,
          deletedAt: user.deletedAt,
        };
      });
      setUserData(users);
    }

    return () => {
      setUserData([]);
    };
  }, [data]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
      </div>
      <div>{error ? <div>Erreur lors du chargement des données</div> : <DataTable columns={columns} data={usersData} isLoading={isLoading} />}</div>
    </div>
  );
}
