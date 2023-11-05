import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col space-y-8 text-center justify-center items-center h-screen -mx-4 -mt-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-sm text-muted-foreground mb-12 block">Entrez vos identifiants pour accéder à l'espace d'administration</p>
        </div>
        <LoginForm />
      </div>
    </>
  );
}
