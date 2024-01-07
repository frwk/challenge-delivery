'use client';

import { Delivery as DBDelivery } from '@/types/delivery';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { DataTable } from '../data-table';
import { Delivery, columns } from './deliveries-columns';

export default function Deliveries() {
  const [deliveriesData, setDeliveryData] = useState<Delivery[]>([]);
  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`, url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data) {
      const deliveries: Delivery[] = data.map((delivery: DBDelivery) => {
        const courier = delivery.courier ?? null;
        return {
          id: delivery.id,
          status: delivery.status,
          userId: delivery.client.id,
          userFullName: `${delivery.client?.firstName} ${delivery.client?.lastName}`,
          courierId: courier?.id ?? null,
          courierFullName: `${courier?.user?.firstName} ${courier?.user?.lastName}`,
          notation: delivery.notation,
          confirmationCode: delivery.confirmationCode,
          pickupAddress: { lon: delivery.pickupLongitude, lat: delivery.pickupLatitude },
          dropoffAddress: { lon: delivery.dropoffLongitude, lat: delivery.dropoffLatitude },
          dropoffDate: delivery.dropoffDate,
          createdAt: delivery.createdAt,
        };
      });
      setDeliveryData(deliveries);
    }

    return () => {
      setDeliveryData([]);
    };
  }, [data]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Livraisons</h2>
      </div>
      <div>
        {error ? <div>Erreur lors du chargement des données</div> : <DataTable columns={columns} data={deliveriesData} isLoading={isLoading} />}
      </div>
    </div>
  );
}
