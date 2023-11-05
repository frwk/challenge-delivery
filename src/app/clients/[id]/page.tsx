'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import * as z from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom est requis' }),
  email: z.string().email({ message: "L'email est invalide" }),
  role: z.enum(['admin', 'support', 'client', 'courier'], { required_error: 'Le rôle est requis' }),
});

export default function ClientDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: clientData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, (url: string) => fetch(url).then(res => res.json()));
  const form = useForm<z.infer<typeof formSchema>>({
    values: clientData,
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      // @ts-ignore
      role: '',
    },
  });

  async function updateClient(url: string, data: { [key: string]: string }) {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data.arg),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const { trigger: triggerUpdate } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, updateClient, {
    onSuccess: () => {
      toast({
        title: 'Client mis à jour',
        description: 'Les informations du client ont bien été mises à jour',
      });
    },
  });

  async function deleteClient(url: string) {
    await fetch(url, {
      method: 'DELETE',
    });
  }
  const { trigger: triggerDelete } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, deleteClient, {
    onSuccess: () => {
      router.push('/clients');
      toast({
        title: 'Client supprimé',
        description: 'Le client a bien été supprimé',
      });
    },
    revalidate: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedUser = { ...clientData, ...values };
    triggerUpdate(updatedUser);
  };

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Détails du client <code>#{params.id}</code>
        </h2>
        {clientData?.deletedAt === null ? (
          <Button variant="destructive" onClick={() => triggerDelete()} disabled={clientData?.deletedAt !== null}>
            Supprimer le client
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => triggerDelete()} disabled={clientData?.deletedAt !== null}>
            Client supprimé
          </Button>
        )}
      </div>
      {clientData && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start space-x-10">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormDescription>Le prénom du client</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormDescription>Le nom du client</FormDescription>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>L&apos;email du client</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Rôle</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={clientData.role}>
                        <SelectTrigger>
                          <SelectValue>{field?.value?.charAt(0).toUpperCase() + field.value?.slice(1)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {['admin', 'support', 'client', 'courier'].map((role, index) => (
                            <SelectItem key={index} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Le rôle du client</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
