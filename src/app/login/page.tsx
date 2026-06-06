import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/login-form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';

export default async function LoginPage() {
  const session = await getAuthenticatedUserFromCookies();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] items-center px-4 py-8 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-black/30 lg:p-12">
          <div className="grid-lines absolute inset-0 opacity-20" />
          <div className="relative">
            <Badge tone="success">Internal Matchmaker Dashboard</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-6xl">
              Manage profiles, notes, and compatibility with a modern CRM built for matchmaking teams.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Use weighted match scoring, AI-generated introduction copy, and a structured profile workspace to keep every customer journey organized.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['100+', 'Realistic profiles'],
                ['AI', 'Explanations + introductions'],
                ['CRM', 'Notes and match history']
              ].map(([value, label]) => (
                <Card key={label} className="bg-slate-950/65">
                  <CardContent className="px-5 py-5">
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-sm text-slate-400">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Card className="self-center">
          <CardHeader>
            <CardTitle>Matchmaker Login</CardTitle>
            <CardDescription>Use the demo credentials to enter the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Demo credentials</p>
              <p className="mt-2">Email: matchmaker@agency.com</p>
              <p>Password: matchmaker123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}