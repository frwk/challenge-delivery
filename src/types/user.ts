import { RolesEnum } from './RolesEnum';
import { Delivery } from './delivery';

export interface User {
  id: number;
  email: string;
  password: string;
  role: RolesEnum;
  createdAt: Date;
  updatedAt: Date;
  deliveries: Delivery[];
}
