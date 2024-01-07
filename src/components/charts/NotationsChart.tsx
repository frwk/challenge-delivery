'use client';

import { Delivery } from '@/types/delivery';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale('fr');

export function NotationsChart({ deliveries }: { deliveries: Delivery[] }) {
  const t = useTranslations('Home.NotationsChart');
  const { resolvedTheme } = useTheme();

  const getDeliveriesByNote = (deliveries: Delivery[]) => {
    const deliveriesByNote = [];
    for (let note = 1; note <= 5; note++) {
      const quantity = deliveries.filter(delivery => delivery.notation === note).length;
      let fill;
      switch (note) {
        case 1:
          fill = 'hsl(0, 70.6%, 45.3%)';
          break;
        case 2:
          fill = 'hsl(36, 70.6%, 45.3%)';
          break;
        case 3:
          fill = 'hsl(72, 70.6%, 45.3%)';
          break;
        case 4:
          fill = 'hsl(107, 70.6%, 45.3%)';
          break;
        case 5:
          fill = 'hsl(142.1, 70.6%, 45.3%)';
          break;
      }
      deliveriesByNote.push({ name: note, value: quantity, fill });
    }
    return deliveriesByNote;
  };

  const data = useMemo(() => getDeliveriesByNote(deliveries), [deliveries]);

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" />
          <Legend iconSize={10} />
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
            formatter={(value, name) => [`${t('ratings', { count: +value })}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
