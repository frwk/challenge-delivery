'use client';

import { Courier } from '@/types/courier';
import { useEffect, useState } from 'react';
import Map, { FullscreenControl, GeolocateControl, NavigationControl, Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IconBike } from '@tabler/icons-react';
import { CourierStatusesEnum } from '@/types/CourierStatusesEnum';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CouriersMap() {
  const t = useTranslations('Map');
  const router = useRouter();
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CourierStatusesEnum | 'all'>('all');

  function getMarkerStyle(status: CourierStatusesEnum) {
    switch (status) {
      case CourierStatusesEnum.AVAILABLE:
        return 'bg-primary';
      case CourierStatusesEnum.ONDELIVERY:
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  }

  function getStatusLabel(status: CourierStatusesEnum) {
    switch (status) {
      case CourierStatusesEnum.AVAILABLE:
        return t('available');
      case CourierStatusesEnum.ONDELIVERY:
        return t('onDelivery');
      default:
        return t('unavailable');
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/couriers/map`);

    eventSource.onmessage = event => {
      setCouriers(JSON.parse(event.data));
    };

    eventSource.onerror = error => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 pt-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('heading')}</h2>
        <Select defaultValue="all" onValueChange={value => setSelectedStatus(value as CourierStatusesEnum)}>
          <SelectTrigger className="w-[180px] ml-auto mb-4">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {Object.values(CourierStatusesEnum).map((element, index) => {
              return (
                <SelectItem key={index} value={element}>
                  {getStatusLabel(element)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Map
        initialViewState={{
          longitude: 2.3522,
          latitude: 48.8566,
          zoom: 11,
        }}
        style={{ position: 'relative', margin: 'auto' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
      >
        <FullscreenControl />
        <GeolocateControl />
        <NavigationControl />
        {Object.values(couriers)
          .filter(livreur => selectedStatus === 'all' || livreur.status === selectedStatus)
          .map((livreurLocation, index) => (
            <Marker
              key={index}
              longitude={livreurLocation.longitude}
              latitude={livreurLocation.latitude}
              anchor="bottom"
              onClick={() => {
                setSelectedCourier(livreurLocation);
              }}
            >
              <div className={`rounded-3xl text-secondary p-2 ${getMarkerStyle(livreurLocation.status)}`}>
                <IconBike size={32} className="icon icon-tabler icon-tabler-bike" />
              </div>
            </Marker>
          ))}
        {selectedCourier && (
          <Popup
            longitude={selectedCourier.longitude}
            latitude={selectedCourier.latitude}
            onClose={() => setSelectedCourier(null)}
            closeOnClick={false}
            closeOnMove={true}
            focusAfterOpen={false}
            anchor="bottom"
            offset={[0, -36] as [number, number]}
            className="text-red [&_.maplibregl-popup-content]:!bg-background [&_.maplibregl-popup-content]:!shadow-xl [&_.maplibregl-popup-tip]:!border-t-background"
          >
            <div className="flex flex-col text-center">
              <span className="font-bold text-lg">
                {selectedCourier.firstName} {selectedCourier.lastName}
              </span>
              <span>{getStatusLabel(selectedCourier.status)}</span>
              <Button variant="link" onClick={() => router.push(`/users/${selectedCourier.user_id}`)}>
                {t('openProfile')}
              </Button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
