'use client';

import { Complaint } from '@/types/complaint';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { DataTable } from '../data-table';
import { Complaint as ComplaintColumns, columns } from './columns';

export default function Complaints() {
  const t = useTranslations('Complaints');
  const [complaintData, setComplaintData] = useState<ComplaintColumns[]>([]);
  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/complaints`, url => fetch(url).then(res => res.json()));

  useEffect(() => {
    if (data) {
      const complaints: ComplaintColumns[] = data.map((complaint: Complaint) => {
        return {
          id: complaint.id,
          status: complaint.status,
          courierFullName: `${complaint.delivery.courier.user?.firstName} ${complaint.delivery.courier.user?.lastName}`,
          userFullName: `${complaint.user?.firstName} ${complaint.user?.lastName}`,
          deliveryDate: complaint.delivery.createdAt,
          complaintDate: complaint.createdAt,
        };
      });
      setComplaintData(complaints);
    }

    return () => {
      setComplaintData([]);
    };
  }, [data]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('heading')}</h2>
      </div>
      <div>{error ? <div>{t('loadingError')}</div> : <DataTable columns={columns} data={complaintData} isLoading={isLoading} />}</div>
    </div>
  );
}
