import { LoginForm } from '@/components/LoginForm';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Login');

  return (
    <>
      <div className="flex flex-col space-y-8 text-center justify-center items-center h-screen -mx-4 -mt-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mb-12 block">{t('description')}</p>
        </div>
        <LoginForm />
      </div>
    </>
  );
}
