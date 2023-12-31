'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { IconCalendar } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations('CalendarDateRangePicker');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const hiddenDays = [
    {
      after: new Date(),
    },
  ];

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant={'outline'} className={cn('w-[260px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
            <IconCalendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{t('chooseDate')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} hidden={hiddenDays} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
