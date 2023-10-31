import { Courier } from './courier';
import { User } from './user';

export interface Delivery {
  id: number;
  pickup: string;
  dropoff: string;
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
