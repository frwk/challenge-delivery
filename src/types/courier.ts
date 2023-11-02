import { CourierStatusesEnum } from './CourierStatusesEnum';
import { Delivery } from './delivery';

export interface Courier {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  latitude: number;
  longitude: number;
  status: CourierStatusesEnum;
  createdAt: Date;
  updatedAt: Date;
  deliveries: Delivery[];
}
