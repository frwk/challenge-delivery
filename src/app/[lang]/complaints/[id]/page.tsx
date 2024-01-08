'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Complaint } from '@/types/complaint';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Chat } from '../../../../components/complaints/chat';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { DeliveriesStatusesEnum } from '@/types/DeliveriesStatusesEnum';
import fetcher from '@/lib/fetcher';
dayjs.locale('fr');

export default function ComplaintsDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const t = useTranslations('Complaints.Details');
  const [complaintData, setComplaintData] = useState<Complaint | null>(null);
  const [deliveryDropoffAddress, setDeliveryDropoffAdress] = useState<string>('');
  const [deliveryPickupAddress, setDeliveryPickupAdress] = useState<string>('');
  const { data, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/complaints/${params.id}`, (url: string) =>
    fetcher(url).then(res => (res.status === 200 ? res.json() : null)),
  );
  const { data: deliveryDropoffAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data?.delivery?.dropoffLongitude}&lat=${data?.delivery?.dropoffLatitude}` : null,
    (url: string) => fetch(url).then(res => res.json()),
  );
  const { data: deliveryPickupAddressData } = useSWR(
    data ? `https://api-adresse.data.gouv.fr/reverse/?lon=${data?.delivery?.pickupLongitude}&lat=${data?.delivery?.pickupLatitude}` : null,
    (url: string) => fetch(url).then(res => res.json()),
  );

  const DELIVERIES_STATUSES_MAPPING: Record<DeliveriesStatusesEnum, string> = {
    [DeliveriesStatusesEnum.PENDING]: t('pendingStatus'),
    [DeliveriesStatusesEnum.ACCEPTED]: t('acceptedStatus'),
    [DeliveriesStatusesEnum.PICKED_UP]: t('pickedUpStatus'),
    [DeliveriesStatusesEnum.DELIVERED]: t('deliveredStatus'),
    [DeliveriesStatusesEnum.CANCELLED]: t('cancelledStatus'),
  };

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
    await fetcher(url, {
      method: 'PATCH',
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
          {t('complaintIdLabel')} <code>#{params.id}</code>
        </h2>
        {complaintData?.status === 'pending' ? (
          <Button variant="default" onClick={markAsResolved}>
            {t('resolvedButton.label')}
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            {t('resolvedStatus')}
          </Button>
        )}
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-col flex-1 gap-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">{t('startConversation.title')}</h3>
            <p className="text-gray-500">{t('startConversation.description')}</p>
          </div>
          {complaintData && <Chat complaint={complaintData} />}
        </div>
        <div className="flex-initial">
          {!isLoading ? (
            <Tabs defaultValue="delivery" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="delivery">{t('orderTabLabel')}</TabsTrigger>
                <TabsTrigger value="user">{t('customerTabLabel')}</TabsTrigger>
                <TabsTrigger value="courier">{t('courierTabLabel')}</TabsTrigger>
              </TabsList>
              <TabsContent value="delivery">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('orderInfoTitle')}</CardTitle>
                    <CardDescription>{t('orderInfoDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      {t('orderNumberLabel')} :{' '}
                      <span className="font-bold">
                        <a href={`/deliveries/${complaintData?.delivery.id}`} className="underline">
                          <code>#{complaintData?.delivery.id}</code>
                        </a>
                      </span>
                    </div>
                    <div className="space-y-1">
                      {t('orderStatusLabel')} :{' '}
                      <span className="font-bold">
                        {complaintData?.delivery?.status && DELIVERIES_STATUSES_MAPPING[complaintData.delivery.status as DeliveriesStatusesEnum]}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {t('pickupAddressLabel')} : <span className="font-bold">{complaintData?.delivery && deliveryPickupAddress}</span>{' '}
                      {complaintData?.delivery?.pickupDate
                        ? `(le ${dayjs(complaintData?.delivery?.pickupDate).format('DD MMMM YYYY à HH:mm')})`
                        : '(non récupéré)'}
                    </div>
                    <div className="space-y-1">
                      {t('deliveryAddressLabel')} : <span className="font-bold">{complaintData?.delivery && deliveryDropoffAddress}</span>{' '}
                      {complaintData?.delivery?.dropoffDate
                        ? `(le ${dayjs(complaintData?.delivery?.dropoffDate).format('DD MMMM YYYY à HH:mm')})`
                        : '(non livré)'}
                    </div>
                    <div className="space-y-1">
                      {t('orderedOnLabel')}{' '}
                      <span className="font-bold">{dayjs(complaintData?.delivery.createdAt).format('DD MMMM YYYY à HH:mm')}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('customerInfoTitle')}</CardTitle>
                    <CardDescription>{t('customerInfoDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      {t('customerNameLabel')} : <span className="font-bold">{complaintData?.user?.firstName}</span>
                    </div>
                    <div className="space-y-1">
                      {t('customerFirstNameLabel')} : <span className="font-bold">{complaintData?.user?.lastName}</span>
                    </div>
                    <div className="space-y-1">
                      {t('customerEmailLabel')} : <span className="font-bold">{complaintData?.user.email}</span>
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
                              {t('viewCustomerButton')}
                            </Button>
                          </TooltipTrigger>
                          {complaintData?.user.deletedAt !== null ? (
                            <TooltipContent>
                              <span className="text-gray-300">{t('deletedCustomerMessage')}</span>
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
                    <CardTitle>{t('courierInfoTitle')}</CardTitle>
                    <CardDescription>{t('courierInfoDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {complaintData?.delivery?.courier === null ? (
                      <div className="space-y-1">
                        {t('courierNameLabel')} : <span className="font-bold">{t('noCourierLabel')}</span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          {t('courierNameLabel')} : <span className="font-bold">{complaintData?.delivery.courier?.user?.firstName}</span>
                        </div>
                        <div className="space-y-1">
                          {t('courierFirstNameLabel')} : <span className="font-bold">{complaintData?.delivery.courier?.user?.lastName}</span>
                        </div>
                        <div className="space-y-1">
                          {t('courierEmailLabel')} : <span className="font-bold">{complaintData?.delivery.courier?.user.email}</span>
                        </div>
                        <div className="space-y-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="link"
                                  onClick={() => router.push(`/couriers/${complaintData?.delivery.courier?.id}`)}
                                  className="pl-0"
                                  disabled={complaintData?.delivery.courier?.user.deletedAt !== null}
                                >
                                  {t('viewCourierButton')}
                                </Button>
                              </TooltipTrigger>
                              {complaintData?.delivery.courier?.user.deletedAt !== null ? (
                                <TooltipContent>
                                  <span className="text-gray-300">{t('deletedCourierMessage')}</span>
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </>
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
