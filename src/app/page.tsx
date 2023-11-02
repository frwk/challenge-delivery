'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveriesChart } from '@/components/charts/DeliveriesChart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnumTimeScope } from '@/types/EnumTimeScope';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Delivery } from '@/types/delivery';
import { NotationsChart } from '@/components/charts/NotationsChart';
import { ComplaintsChart } from '@/components/charts/ComplaintsChart';
import { User } from '@/types/user';
import { UsersChart } from '@/components/charts/UsersChart';
import { Complaint } from '@/types/complaint';

export default function Home() {
  const [timeScope, setTimeScope] = useState<EnumTimeScope>(EnumTimeScope.DAY);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const onTimeScopeChange = (value: string) => {
    setTimeScope(value as EnumTimeScope);
  };

  useEffect(() => {
    async function fetchDeliveries() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`);
      const data = await response.json();
      setDeliveries(data);
    }
    async function fetchUsers() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    }
    async function fetchComplaints() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/complaints`);
      const data = await response.json();
      setComplaints(data);
    }
    fetchDeliveries();
    fetchUsers();
    fetchComplaints();
  }, [timeScope]);

  const scopedDeliveries = () => {
    return timeScope === EnumTimeScope.ALL
      ? deliveries
      : deliveries?.filter(delivery => dayjs(delivery.dropoffDate).isAfter(dayjs().subtract(1, timeScope)));
  };

  const scopedComplaints = () => {
    return timeScope === EnumTimeScope.ALL
      ? complaints
      : complaints?.filter(complaint => dayjs(complaint.createdAt).isAfter(dayjs().subtract(1, timeScope)));
  };

  const scopedUsers = () => {
    const clients = users?.filter(user => user.role === 'client');
    return timeScope === EnumTimeScope.ALL ? clients : clients?.filter(user => dayjs(user.createdAt).isAfter(dayjs().subtract(1, timeScope)));
  };

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs onValueChange={onTimeScopeChange} defaultValue={EnumTimeScope.DAY}>
        <TabsList>
          <TabsTrigger value={EnumTimeScope.ALL}>Tout</TabsTrigger>
          <TabsTrigger value={EnumTimeScope.DAY}>Aujourd&apos;hui</TabsTrigger>
          <TabsTrigger value={EnumTimeScope.WEEK}>Semaine</TabsTrigger>
          <TabsTrigger value={EnumTimeScope.MONTH}>Mois</TabsTrigger>
          <TabsTrigger value={EnumTimeScope.YEAR}>Année</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Nombre de livraisons</CardTitle>
            <CardDescription>Total des livraisons accomplies au cours de la période</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">{deliveries.length && <DeliveriesChart deliveries={scopedDeliveries()} timeScope={timeScope} />}</CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Evaluations des commandes</CardTitle>
            <CardDescription>Répartition des notes données par les clients suite à leurs commandes</CardDescription>
          </CardHeader>
          <CardContent>{deliveries.length && <NotationsChart deliveries={scopedDeliveries()} />}</CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Réclamations</CardTitle>
          </CardHeader>
          <CardContent>{complaints.length && <ComplaintsChart complaints={scopedComplaints()} timeScope={timeScope} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux clients</CardTitle>
          </CardHeader>
          <CardContent>{users.length && <UsersChart users={scopedUsers()} timeScope={timeScope} />}</CardContent>
        </Card>
      </div>
    </div>
  );
}
