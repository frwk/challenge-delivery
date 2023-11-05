'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2 } from '@tabler/icons-react';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface LoginForm extends React.HTMLAttributes<HTMLDivElement> {}

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "L'email n'est pas valide.",
    })
    .min(2, {
      message: "L'email doit faire au moins 2 caractères.",
    }),
  password: z.string().min(8, {
    message: 'Le mot de passe doit faire au moins 8 caractères.',
  }),
});

export function LoginForm() {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const { data, error } = await login(values);
    if (error) {
      if (error.statusCode === 401) {
        form.setError('root', {
          message: 'Idenfiants incorrects',
        });
      } else {
        form.setError('root', {
          message: 'Erreur inconnue',
        });
      }
    }
    if (data) {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-80">
        {form.formState.errors.root?.message && (
          <Alert className="bg-destructive">
            <AlertCircle className="h-8 w-8" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl className={cn(form.formState.errors.email && 'border-2 border-red-500')}>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage className="text-left text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl className={cn(form.formState.errors.password && 'border-2 border-red-500')}>
                <Input type="password" {...field} placeholder="Mot de passe" />
              </FormControl>
              <FormMessage className="text-left text-xs" />
            </FormItem>
          )}
        />
        {form.formState.isSubmitting ? (
          <Button disabled type="submit">
            <IconLoader2 className="animate-spin" color="#000" />
          </Button>
        ) : (
          <Button type="submit" size="lg">
            Se connecter
          </Button>
        )}
      </form>
    </Form>
  );
}
