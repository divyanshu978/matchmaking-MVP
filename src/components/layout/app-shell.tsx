import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AppShell({ title, subtitle, userName, userEmail, children }: Readonly<{ title: string; subtitle: string; userName: string; userEmail: string; children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 lg:px-8">
      <header className="glass mb-4 rounded-3xl px-5 py-4 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/25">M</div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-rose-300/80">Matchmaking CRM</p>
                <h1 className="text-2xl font-semibold text-white lg:text-3xl">{title}</h1>
              </div>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="success">AI Assisted</Badge>
            <Badge tone="warning">Dark Mode</Badge>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="secondary" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="hidden h-fit overflow-hidden lg:block">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed in as</p>
            <p className="mt-1 text-lg font-semibold text-slate-50">{userName}</p>
            <p className="text-sm text-slate-400">{userEmail}</p>
          </div>
          <div className="space-y-2 px-3 py-4">
            <Link className="block rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-800" href="/dashboard">
              All Customers
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-800" href="/dashboard?status=Active%20Search">
              Active Searches
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-800" href="/dashboard?status=Family%20Discussion">
              Family Discussion
            </Link>
          </div>
        </Card>
        <div>{children}</div>
      </main>
    </div>
  );
}