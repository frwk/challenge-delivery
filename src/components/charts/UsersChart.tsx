'use client';

import { EnumTimeScope } from '@/types/EnumTimeScope';
import { User } from '@/types/user';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('fr');

export function UsersChart({ users, timeScope }: { users: User[]; timeScope: EnumTimeScope }) {
  const t = useTranslations('Home.UsersChart');
  const { resolvedTheme } = useTheme();

  function createDataObjects(timeScope: EnumTimeScope) {
    const currentDate = dayjs();
    const data = [];

    switch (timeScope) {
      case 'day':
        for (let hour = 0; hour < 24; hour++) {
          const label = currentDate.hour(hour).format('HH[h]00');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'week':
        for (let day = 0; day < 7; day++) {
          const label = currentDate.startOf('week').add(day, 'day').format('dddd');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'month':
        const weeksInMonth = currentDate.endOf('month').week() - currentDate.startOf('month').week() + 1;
        for (let week = 0; week < weeksInMonth; week++) {
          const createdAt = currentDate.startOf('month').add(week, 'week');
          const label = `du ${createdAt.startOf('week').format('DD/MM')} au ${createdAt.endOf('week').format('DD/MM')}`;
          data.push({ label, quantity: 0 });
        }
        break;

      case 'year':
        for (let month = 0; month < 12; month++) {
          const label = currentDate.month(month).format('MMMM');
          data.push({ label, quantity: 0 });
        }
        break;

      case 'all':
        for (let year = 5; year > 0; year--) {
          const label = currentDate.subtract(year, 'year').format('YYYY');
          data.push({ label, quantity: 0 });
        }
        break;
    }
    return data;
  }

  const superData = useMemo(() => getData(users, timeScope), [users, timeScope]);

  function getData(users: User[], timeScope: EnumTimeScope) {
    const data = createDataObjects(timeScope);
    users?.forEach(user => {
      let dateKey: string;
      const createdAt = dayjs(user.createdAt);

      switch (timeScope) {
        case 'day':
          dateKey = createdAt.format('HH[h]00');
          break;
        case 'week':
          dateKey = createdAt.format('dddd');
          break;
        case 'month':
          dateKey = `du ${createdAt.startOf('week').format('DD/MM')} au ${createdAt.endOf('week').format('DD/MM')}`;
          break;
        case 'year':
          dateKey = createdAt.format('MMMM');
          break;
        case 'all':
          dateKey = createdAt.format('YYYY');
          break;
        default:
          dateKey = createdAt.format('YYYY-MM-DD');
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
        <ComposedChart data={superData}>
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
            formatter={value => [t('signups', { count: +value }), null]}
          />
          <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis type="number" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Line type="monotone" dataKey="quantity" fill="hsl(142.1 70.6% 45.3%)" stroke="hsl(142.1 70.6% 45.3%)" />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
