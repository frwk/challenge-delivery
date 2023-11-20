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

export default function UserDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: userData } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, (url: string) => fetch(url).then(res => res.json()));
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
        title: 'Utilisateur mis à jour',
        description: "Les informations de l'utilisateur ont bien été mises à jour",
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
        title: 'Utilisateur supprimé',
        description: "L'utilisateur a été supprimé avec succès",
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
          Détails de l'utilisateur <code>#{params.id}</code>
        </h2>
        {userData?.deletedAt === null ? (
          <Button variant="destructive" onClick={() => triggerDelete()} disabled={userData?.deletedAt !== null}>
            Supprimer l'utilisateur
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => triggerDelete()} disabled={userData?.deletedAt !== null}>
            Utilisateur supprimé
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
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormDescription>Le prénom de l&apos;utilisateur</FormDescription>
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
                    <FormDescription>Le nom de l&apos;utilisateur</FormDescription>
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
                    <FormDescription>L&apos;email de l&apos;utilisateur</FormDescription>
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
                      <Select onValueChange={field.onChange} value={userData.role}>
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
                    <FormDescription>Le rôle de l&apos;utilisateur</FormDescription>
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
