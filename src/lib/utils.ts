import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DELIVERIES_STATUSES_MAPPING: Record<string, string> = {
  [DeliveriesStatusesEnum.PENDING]: 'En attente',
  [DeliveriesStatusesEnum.ACCEPTED]: 'Confirmé',
  [DeliveriesStatusesEnum.PICKED_UP]: 'En cours de livraison',
  [DeliveriesStatusesEnum.DELIVERED]: 'Livré',
  [DeliveriesStatusesEnum.CANCELLED]: 'Annulé',
};

type LatLng = {
  latitude: number;
  longitude: number;
};
export const calculateMidPoint = (latLngA: LatLng, latLngB: LatLng): { midLatitude: number; midLongitude: number } => {
  function toRadians(degress: number): number {
    return degress * (Math.PI / 180);
  }

  function toDegrees(radians: number): string {
    return (radians * (180 / Math.PI)).toFixed(4);
  }

  const lngDiff = toRadians(latLngB.longitude - latLngA.longitude);
  const latA = toRadians(latLngA.latitude);
  const latB = toRadians(latLngB.latitude);
  const lngA = toRadians(latLngA.longitude);

  const bx = Math.cos(latB) * Math.cos(lngDiff);
  const by = Math.cos(latB) * Math.sin(lngDiff);

  const midLatitude = toDegrees(Math.atan2(Math.sin(latA) + Math.sin(latB), Math.sqrt((Math.cos(latA) + bx) * (Math.cos(latA) + bx) + by * by)));
  const midLongitude = toDegrees(lngA + Math.atan2(by, Math.cos(latA) + bx));

  return { midLatitude: Number(midLatitude), midLongitude: Number(midLongitude) };
};
