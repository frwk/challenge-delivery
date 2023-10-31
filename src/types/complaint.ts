import { ComplaintStatusesEnum } from './ComplaintStatusesEnum';
import { Delivery } from './delivery';
import { User } from './user';

export interface Complaint {
  id: number;
  status: ComplaintStatusesEnum;
  userId: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  deliveryId: number;
  delivery: Delivery;
}
