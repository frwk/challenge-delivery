'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DELIVERIES_STATUSES_MAPPING } from '@/lib/utils';
import { Complaint } from '@/types/complaint';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Chat } from '../../../components/complaints/chat';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
dayjs.locale('fr');

export default function ComplaintsDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [complaintData, setComplaintData] = useState<Complaint | null>(null);
  const [deliveryDropoffAddress, setDeliveryDropoffAdress] = useState<string>('');
  const [deliveryPickupAddress, setDeliveryPickupAdress] = useState<string>('');
  const { data, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/complaints/${params.id}`, (url: string) =>
    fetch(url).then(res => (res.status === 200 ? res.json() : null)),
  );
  const { data: deliveryDropoffAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data?.delivery?.dropoffLongitude}&lat=${data?.delivery?.dropoffLatitude}` : null,
    (url: string) => fetch(url).then(res => res.json()),
  );
  const { data: deliveryPickupAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data?.delivery?.pickupLongitude}&lat=${data?.delivery?.pickupLatitude}` : null,
    (url: string) => fetch(url).then(res => res.json()),
  );

  useEffect(() => {
    if (data === null) return router.push('/complaints');
    if (!isLoading && data && deliveryDropoffAddressData && deliveryPickupAddressData) {
      setComplaintData(data);
      setDeliveryPickupAdress(deliveryPickupAddressData.features[0]?.properties?.label ?? '');
      setDeliveryDropoffAdress(deliveryDropoffAddressData.features[0]?.properties?.label ?? '');
    }

    return () => {
      setComplaintData(null);
    };
  }, [data, deliveryDropoffAddressData, deliveryPickupAddressData, isLoading, router]);

  async function updateComplaint(url: string, { arg }: { arg: string }) {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ status: arg }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const { trigger } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/complaints/${params.id}`, updateComplaint);

  const markAsResolved = async () => {
    trigger('resolved');
  };

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Réclamation <code>#{params.id}</code>
        </h2>
        {complaintData?.status === 'pending' ? (
          <Button variant="default" onClick={markAsResolved}>
            Marquer comme résolu
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            Réclamation résolue
          </Button>
        )}
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-col flex-1 gap-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Démarrer une conversation</h3>
            <p className="text-gray-500">Discutez avec le client pour résoudre le problème.</p>
          </div>
          {complaintData && <Chat complaint={complaintData} />}
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
                        <code>#{complaintData?.delivery.id}</code>
                      </span>
                    </div>
                    <div className="space-y-1">
                      Statut de la commande: <span className="font-bold">{DELIVERIES_STATUSES_MAPPING[complaintData?.delivery.status]}</span>
                    </div>
                    <div className="space-y-1">
                      Adresse de récupération: <span className="font-bold">{complaintData?.delivery && deliveryPickupAddress}</span>
                    </div>
                    <div className="space-y-1">
                      Adresse de livraison: <span className="font-bold">{complaintData?.delivery && deliveryDropoffAddress}</span>
                    </div>
                    <div className="space-y-1">
                      Commandé le <span className="font-bold">{dayjs(complaintData?.delivery.createdAt).format('DD MMMM YYYY à HH:mm')}</span>
                    </div>
                    <div className="space-y-1">
                      Livré le <span className="font-bold">{dayjs(complaintData?.delivery.dropoffDate).format('DD MMMM YYYY à HH:mm')}</span>
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
                      Nom: <span className="font-bold">{complaintData?.user.firstName}</span>
                    </div>
                    <div className="space-y-1">
                      Prénom: <span className="font-bold">{complaintData?.user.lastName}</span>
                    </div>
                    <div className="space-y-1">
                      Email: <span className="font-bold">{complaintData?.user.email}</span>
                    </div>
                    <div className="space-y-1 flex flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="link"
                              onClick={() => router.push(`/users/${complaintData?.user.id}`)}
                              className="pl-0"
                              disabled={complaintData?.user.deletedAt !== null}
                            >
                              Voir le client
                            </Button>
                          </TooltipTrigger>
                          {complaintData?.user.deletedAt !== null ? (
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
                    <div className="space-y-1">
                      Nom: <span className="font-bold">{complaintData?.delivery.courier.user.firstName}</span>
                    </div>
                    <div className="space-y-1">
                      Prénom: <span className="font-bold">{complaintData?.delivery.courier.user.lastName}</span>
                    </div>
                    <div className="space-y-1">
                      Email: <span className="font-bold">{complaintData?.delivery.courier.user.email}</span>
                    </div>
                    <div className="space-y-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="link"
                              onClick={() => router.push(`/users/${complaintData?.delivery.courier.user.id}`)}
                              className="pl-0"
                              disabled={complaintData?.delivery.courier.user.deletedAt !== null}
                            >
                              Voir le livreur
                            </Button>
                          </TooltipTrigger>
                          {complaintData?.delivery.courier.user.deletedAt !== null ? (
                            <TooltipContent>
                              <span className="text-gray-300">Ce livreur a été supprimé.</span>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
