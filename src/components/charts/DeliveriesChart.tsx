'use client';

import { EnumTimeScope } from '@/types/EnumTimeScope';
import { Delivery } from '@/types/delivery';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import 'dayjs/locale/fr';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('fr');

export function DeliveriesChart({ deliveries, timeScope }: { deliveries: Delivery[]; timeScope: EnumTimeScope }) {
  const t = useTranslations('Home.DeliveriesChart');
  const { resolvedTheme } = useTheme();

  function createDataObjects(timeScope: EnumTimeScope) {
    const currentDate = dayjs();
    const data = [];

    switch (timeScope) {
      case 'day':
        for (let hour = 24; hour > 0; hour--) {
          const label = currentDate.clone().subtract(hour, 'hour').format('HH[h]');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'week':
        for (let day = 7; day > 0; day--) {
          const label = currentDate.clone().subtract(day, 'day').format('dddd (DD/MM)');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'month':
        const lastMonth = currentDate.clone().subtract(1, 'month');
        const weeks = currentDate.clone().diff(lastMonth, 'weeks');
        for (let week = 0; week <= weeks; week++) {
          const dropoffDate = lastMonth.clone().add(week, 'week');
          const label = `du ${dropoffDate.startOf('week').format('DD/MM')} au ${dropoffDate.endOf('week').format('DD/MM')}`;
          data.push({ label, quantity: 0 });
        }
        break;

      case 'year':
        for (let month = 12; month > 0; month--) {
          const label = currentDate.clone().subtract(month, 'month').format('MM/YYYY');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'all':
        for (let year = 5; year > 0; year--) {
          const label = currentDate.clone().subtract(year, 'year').format('YYYY');
          data.push({ label, quantity: 0 });
        }
        break;
    }
    return data;
  }

  const data = useMemo(() => getData(deliveries, timeScope), [deliveries, timeScope]);

  function getData(deliveries: Delivery[], timeScope: EnumTimeScope) {
    const data = createDataObjects(timeScope);
    deliveries?.forEach(delivery => {
      let dateKey: string;
      if (delivery.dropoffDate === null) return;
      const dropoffDate = dayjs(delivery.dropoffDate);

      switch (timeScope) {
        case 'day':
          dateKey = dropoffDate.format('HH[h]');
          break;
        case 'week':
          dateKey = dropoffDate.format('dddd (DD/MM)');
          break;
        case 'month':
          dateKey = `du ${dropoffDate.startOf('week').format('DD/MM')} au ${dropoffDate.endOf('week').format('DD/MM')}`;
          break;
        case 'year':
          dateKey = dropoffDate.format('MM/YYYY');
          break;
        case 'all':
          dateKey = dropoffDate.format('YYYY');
          break;
        default:
          dateKey = '';
      }

      const existingDataItem = data.find(item => item.label === dateKey);
      if (existingDataItem) {
        existingDataItem.quantity += 1;
      } else {
        data.push({ label: dateKey, quantity: 1 });
      }
    });
    return data;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <Tooltip
            wrapperClassName="flex flex-col justify-center items-center rounded shadow-md text-sm"
            contentStyle={
              resolvedTheme === 'dark'
                ? {
                    backgroundColor: 'hsl(0 0% 9%)',
                    borderColor: 'hsl(240 3.7% 15.9%)',
                  }
                : {
                    backgroundColor: 'hsl(0 0% 100%)',
                    borderColor: 'hsl(240 5.9% 90%)',
                  }
            }
            itemStyle={{
              color: resolvedTheme === 'dark' ? 'hsl(0 0% 95%)' : 'hsl(240 10% 3.9%)',
              fontWeight: '600',
            }}
            formatter={value => [t('deliveries', { count: +value }), null]}
          />
          <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} interval={1} tick={{ fill: 'white' }} />
          <YAxis type="number" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: 'white' }} />
          <Bar dataKey="quantity" fill="hsl(142.1 70.6% 45.3%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
