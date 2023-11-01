export enum CourierStatusesEnum {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  ONDELIVERY = 'on_delivery',
}

export function getStatusLabel(status: CourierStatusesEnum) {
  switch (status) {
    case CourierStatusesEnum.AVAILABLE:
      return 'Disponible';
    case CourierStatusesEnum.ONDELIVERY:
      return 'En livraison';
    default:
      return 'Indisponible';
  }
}
