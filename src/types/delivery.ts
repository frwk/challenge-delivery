import { Courier } from './courier';
import { User } from './user';

export interface Delivery {
  id: number;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  pickupDate: Date;
  dropoffDate: Date;
  confirmationCode: string;
  status: string;
  clientId: number;
  client: User;
  courierId: number;
  courier: Courier;
  createdAt: Date;
  updatedAt: Date;
  notation: number;
}
