'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2 } from '@tabler/icons-react';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface LoginForm extends React.HTMLAttributes<HTMLDivElement> {}

const FormSchema = z.object({
  email: z.string().email().min(2, {
    message: "L'email doit faire au moins 2 caractères.",
  }),
  password: z.string().min(8, {
    message: 'Le mot de passe doit faire au moins 8 caractères.',
  }),
});

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80">
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
              <FormLabel className="text-left block">Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <Button disabled type="submit">
            <IconLoader2 className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit" size="lg">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
