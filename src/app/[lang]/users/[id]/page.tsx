'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import * as z from 'zod';

export default function UserDetails({ params }: { params: { id: string } }) {
  const t = useTranslations('Users.Details');
  const router = useRouter();
  const { toast } = useToast();
  const { data: userData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, (url: string) => fetch(url).then(res => res.json()));

  const formSchema = z.object({
    firstName: z.string().min(1, { message: t('firstName.required') }),
    lastName: z.string().min(1, { message: t('lastName.required') }),
    email: z.string().email({ message: t('email.invalid') }),
    role: z.enum(['admin', 'support', 'client', 'courier'], { required_error: t('role.required') }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    values: userData,
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: undefined,
    },
  });

  async function updateUser(url: string, data: { [key: string]: string }) {
    await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data.arg),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const { trigger: triggerUpdate } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, updateUser, {
    onSuccess: () => {
      toast({
        title: t('updateSuccessTitle'),
        description: t('updateSuccessDescription'),
      });
    },
  });

  async function deleteUser(url: string) {
    await fetch(url, {
      method: 'DELETE',
    });
  }
  const { trigger: triggerDelete } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, deleteUser, {
    onSuccess: () => {
      router.push('/users');
      toast({
        title: t('deleteSuccessTitle'),
        description: t('deleteSuccessDescription'),
      });
    },
    revalidate: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedUser = { ...userData, ...values };
    triggerUpdate(updatedUser);
  };

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('userDetailsTitle')} <code>#{params.id}</code>
        </h2>
        {userData?.deletedAt === null ? (
          <Button variant="destructive" onClick={() => triggerDelete()} disabled={userData?.deletedAt !== null}>
            {t('deleteUserButton')}
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => triggerDelete()} disabled={userData?.deletedAt !== null}>
            {t('userDeletedButton')}
          </Button>
        )}
      </div>
      {userData && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start space-x-10">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('firstName.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('firstName.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>{t('firstName.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('lastName.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('lastName.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>{t('lastName.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-start space-x-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('email.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('email.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>{t('email.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('role.label')}</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={userData.role}>
                        <SelectTrigger>
                          <SelectValue>{field?.value?.charAt(0).toUpperCase() + field.value?.slice(1)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {['admin', 'support', 'client', 'courier'].map((role, index) => (
                            <SelectItem key={index} value={role}>
                              {t(`role.options.${role}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>{t('role.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">{t('saveButton')}</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
