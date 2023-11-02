import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DELIVERIES_STATUSES_MAPPING: Record<DeliveriesStatusesEnum, string> = {
  [DeliveriesStatusesEnum.PENDING]: 'En attente',
  [DeliveriesStatusesEnum.PICKED_UP]: 'En cours de livraison',
  [DeliveriesStatusesEnum.DELIVERED]: 'Livré',
  [DeliveriesStatusesEnum.CANCELLED]: 'Annulé',
};
