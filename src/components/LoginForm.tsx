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
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface LoginForm extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm() {
  const { login } = useAuth();
  const t = useTranslations('Login.Form');

  const FormSchema = z.object({
    email: z
      .string()
      .email({
        message: t('emailInvalid'),
      })
      .min(2, {
        message: t('emailMinLength'),
      }),
    password: z.string().min(8, {
      message: t('passwordMinLength'),
    }),
  });
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
          message: t('incorrectCredentials'),
        });
      } else {
        form.setError('root', {
          message: t('unknownError'),
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
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl className={cn(form.formState.errors.email && 'border-2 border-red-500')}>
                <Input {...field} placeholder={t('emailPlaceholder')} />
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
                <Input type="password" {...field} placeholder={t('passwordPlaceholder')} />
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
            {t('loginButton')}
          </Button>
        )}
      </form>
    </Form>
  );
}
