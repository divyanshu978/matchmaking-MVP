import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { getCustomers } from '@/lib/store';

export default async function DashboardPage() {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    redirect('/login');
  }

  const customers = getCustomers();

  return (
    <AppShell
      title="Assigned Customers"
      subtitle="Search assigned profiles, inspect biodata, and open individual customer workspaces to review notes and matches."
      userName={session.name}
      userEmail={session.email}
    >
      <DashboardClient customers={customers} />
    </AppShell>
  );
}