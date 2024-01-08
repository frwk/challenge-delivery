'use client';

import MapDirection from '@/components/MapDirection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import fetcher from '@/lib/fetcher';
import { DELIVERIES_STATUSES_MAPPING } from '@/lib/utils';
import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import { Delivery } from '@/types/delivery';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import useSWR from 'swr';
dayjs.locale('fr');

interface MessageData {
  courierId: number;
  coordinates: Coordinates;
}

interface MessageResponse {
  type: string;
  data: MessageData;
}

type Coordinates = [number, number];

export default function DeliveryDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [deliveryData, setDeliveryData] = useState<Delivery | null>(null);
  const [courierPosition, setCourierPosition] = useState<Coordinates | null>(null);
  const [deliveryDropoffAddress, setDeliveryDropoffAddress] = useState<string>('');
  const [deliveryPickupAddress, setDeliveryPickupAddress] = useState<string>('');
  const { data, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/${params.id}`, (url: string) =>
    fetcher(url).then(res => (res.status === 200 ? res.json() : null)),
  );
  const { data: deliveryDropoffAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data.dropoffLongitude}&lat=${data.dropoffLatitude}` : null,
    (url: string) => fetcher(url).then(res => res.json()),
  );
  const { data: deliveryPickupAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data.pickupLongitude}&lat=${data.pickupLatitude}` : null,
    (url: string) => fetcher(url).then(res => res.json()),
  );

  const { lastJsonMessage } = useWebSocket(`${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/ws/delivery-tracking/${params.id}`);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const coordinates = (lastJsonMessage as MessageResponse)?.data.coordinates;
    if ((lastJsonMessage as MessageResponse).type === 'location') {
      setCourierPosition([coordinates[0], coordinates[1]]);
    }
  }, [lastJsonMessage]);

  // const fetchAddress = async (lon: number, lat: number) => {
  //   const response = await fetcher(`https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}&format=json`);
  //   const data = await response.json();
  //   return `${data.address.house_number} ${data.address.road}, ${data.address.postcode} ${data.address.city}`;
  // };

  useEffect(() => {
    if (data === null) return router.push('/deliveries');
    if (!isLoading && data && deliveryDropoffAddressData && deliveryPickupAddressData) {
      setDeliveryData(data);
      setDeliveryPickupAddress(deliveryPickupAddressData.features[0]?.properties?.label ?? '');
      setDeliveryDropoffAddress(deliveryDropoffAddressData.features[0]?.properties?.label ?? '');
    }

    return () => {
      setDeliveryData(null);
    };
  }, [data, isLoading, router, deliveryDropoffAddressData, deliveryPickupAddressData]);

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Commande <code>#{params.id}</code>
        </h2>
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-col flex-1 gap-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Informations sur la commande</h3>
            <p className="text-gray-500">Où se trouve la commande ?</p>
          </div>
          {deliveryData && (
            <MapDirection
              marker={courierPosition}
              from={{ latitude: deliveryData.pickupLatitude, longitude: deliveryData.pickupLongitude }}
              to={{ latitude: deliveryData.dropoffLatitude, longitude: deliveryData.dropoffLongitude }}
              status={deliveryData.status}
            />
          )}
        </div>
        <div className="flex-initial">
          {!isLoading ? (
            <Tabs defaultValue="delivery" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="delivery">Commande</TabsTrigger>
                <TabsTrigger value="user">Client</TabsTrigger>
                <TabsTrigger value="courier">Livreur</TabsTrigger>
              </TabsList>
              <TabsContent value="delivery">
                <Card>
                  <CardHeader>
                    <CardTitle>Information sur la commande</CardTitle>
                    <CardDescription>Informations sur la commande ayant fait l&apos;objet de la réclamation.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      Numéro de commande:{' '}
                      <span className="font-bold">
                        <code>#{deliveryData?.id}</code>
                      </span>
                    </div>
                    <div className="space-y-1">
                      Statut de la commande:{' '}
                      <span className="font-bold">{DELIVERIES_STATUSES_MAPPING[deliveryData?.status as DeliveriesStatusesEnum]}</span>
                    </div>
                    <div className="space-y-1">
                      Code de confirmation:{' '}
                      <span className="font-bold">
                        <code>{deliveryData?.confirmationCode}</code>
                      </span>
                    </div>
                    <div className="space-y-1">
                      Adresse de récupération: <span className="font-bold">{deliveryData && deliveryPickupAddress}</span>{' '}
                      {deliveryData?.pickupDate ? `(le ${dayjs(deliveryData?.pickupDate).format('DD MMMM YYYY à HH:mm')}).` : '(non récupéré)'}
                    </div>
                    <div className="space-y-1">
                      Adresse de livraison: <span className="font-bold">{deliveryData && deliveryDropoffAddress}</span>{' '}
                      {deliveryData?.dropoffDate ? `(le ${dayjs(deliveryData?.dropoffDate).format('DD MMMM YYYY à HH:mm')}).` : '(non livré)'}
                    </div>
                    <div className="space-y-1">
                      Commandé le <span className="font-bold">{dayjs(deliveryData?.createdAt).format('DD MMMM YYYY à HH:mm')}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>Information du client</CardTitle>
                    <CardDescription>Informations du client ayant fait la réclamation.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      Nom: <span className="font-bold">{deliveryData?.client?.firstName}</span>
                    </div>
                    <div className="space-y-1">
                      Prénom: <span className="font-bold">{deliveryData?.client?.lastName}</span>
                    </div>
                    <div className="space-y-1">
                      Email: <span className="font-bold">{deliveryData?.client.email}</span>
                    </div>
                    <div className="space-y-1 flex flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="link"
                              onClick={() => router.push(`/users/${deliveryData?.client.id}`)}
                              className="pl-0"
                              disabled={deliveryData?.client.deletedAt !== null}
                            >
                              Voir le client
                            </Button>
                          </TooltipTrigger>
                          {deliveryData?.client.deletedAt !== null ? (
                            <TooltipContent>
                              <span className="text-gray-300">Ce client a été supprimé.</span>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="courier">
                <Card>
                  <CardHeader>
                    <CardTitle>Information du livreur</CardTitle>
                    <CardDescription>Informations du livreur ayant livré la commande.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {deliveryData?.courier ? (
                      <>
                        <div className="space-y-1">
                          Nom: <span className="font-bold">{deliveryData.courier.user?.firstName}</span>
                        </div>
                        <div className="space-y-1">
                          Prénom: <span className="font-bold">{deliveryData.courier.user?.lastName}</span>
                        </div>
                        <div className="space-y-1">
                          Email: <span className="font-bold">{deliveryData.courier.user.email}</span>
                        </div>
                        <div className="space-y-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="link"
                                  onClick={() => router.push(`/users/${deliveryData.courier.user.id}`)}
                                  className="pl-0"
                                  disabled={deliveryData.courier.user.deletedAt !== null}
                                >
                                  Voir le livreur
                                </Button>
                              </TooltipTrigger>
                              {deliveryData.courier.user.deletedAt !== null ? (
                                <TooltipContent>
                                  <span className="text-gray-300">Ce livreur a été supprimé.</span>
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <span className="font-bold">Aucun livreur n&apos;a été assigné à cette commande.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      </div>
    </div>
  );
}
