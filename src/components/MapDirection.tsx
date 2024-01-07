import { calculateMidPoint } from '@/lib/utils';
import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import { IconBike, IconMapPin } from '@tabler/icons-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect } from 'react';
import Map, { FullscreenControl, GeolocateControl, Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import useSWRMutation from 'swr/mutation';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type MapDirectionProps = {
  marker: [number, number] | null;
  from: Coordinates;
  to: Coordinates;
  status: DeliveriesStatusesEnum;
};

const MapDirection = ({ marker = null, from, to, status }: MapDirectionProps) => {
  const { midLatitude, midLongitude } = calculateMidPoint(from, to);

  async function postDirection(url: string) {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        from: [from.latitude, from.longitude],
        to: [to.latitude, to.longitude],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  }
  const { trigger: triggerGetDirection, data: polylineCoordinates } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/deliveries/direction`,
    postDirection,
  );

  useEffect(() => {
    triggerGetDirection();
  }, [triggerGetDirection]);

  const lineData = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      // NOTE: Mapbox uses [longitude, latitude] while Google Maps uses [latitude, longitude] so we need to reverse the coordinates
      coordinates: polylineCoordinates?.map(([a, b]: [number, number]) => [b, a]),
    },
  };

  function getDirectionLineBg(): string {
    switch (status) {
      case DeliveriesStatusesEnum.PENDING:
        return '#f97316';
      case DeliveriesStatusesEnum.ACCEPTED:
        return '#3b82f6';
      case DeliveriesStatusesEnum.PICKED_UP:
        return '#eab308';
      case DeliveriesStatusesEnum.DELIVERED:
        return '#22c55e';
      case DeliveriesStatusesEnum.CANCELLED:
        return '#ef4444';
      default:
        return '#ef4444';
    }
  }

  return (
    <Map
      initialViewState={{
        latitude: midLatitude,
        longitude: midLongitude,
        zoom: 13,
      }}
      style={{ position: 'relative', margin: 'auto' }}
      mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      {marker && (
        <Marker latitude={marker[0]} longitude={marker[1]} anchor="bottom">
          <div className={`rounded-3xl text-secondary`}>
            <IconBike size={32} className="icon icon-tabler icon-tabler-bike" />
          </div>
        </Marker>
      )}
      <Marker latitude={from.latitude} longitude={from.longitude} anchor="bottom">
        <IconMapPin color={getDirectionLineBg()} size={32} className="icon icon-tabler icon-tabler-bike" />
      </Marker>
      <Marker latitude={to.latitude} longitude={to.longitude} anchor="bottom">
        <IconMapPin color={getDirectionLineBg()} size={32} className="icon icon-tabler icon-tabler-bike" />
      </Marker>
      <Source id="route" type="geojson" data={polylineCoordinates ? lineData : null}>
        <Layer
          id="route"
          type="line"
          layout={{ 'line-join': 'round', 'line-cap': 'round' }}
          paint={{ 'line-width': 8, 'line-color': getDirectionLineBg() }}
        />
      </Source>
    </Map>
  );
};

export default MapDirection;
