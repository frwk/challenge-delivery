import { RolesEnum } from './RolesEnum';
import { Delivery } from './delivery';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RolesEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deliveries: Delivery[];
}

export interface UserAuth {
  id: User['id'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  email: User['email'];
  role: User['role'];
}
