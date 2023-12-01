import { CourierStatusesEnum } from './CourierStatusesEnum';
import { Delivery } from './delivery';
import { User } from './user';

export interface Courier {
  id: number;
  isAvailable: boolean;
  user: User;
  user_id: number;
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
