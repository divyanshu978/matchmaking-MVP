import { notFound, redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { ProfileClient } from '@/components/customer/profile-client';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { buildSuggestions } from '@/lib/suggestions';
import { getCustomerById, getCustomers, getMatchesByCustomerId, getNotesByCustomerId } from '@/lib/store';

type CustomerPageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    redirect('/login');
  }

  const { customerId } = await params;
  const customer = getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const customers = getCustomers();
  const notes = getNotesByCustomerId(customer.id);
  const matches = getMatchesByCustomerId(customer.id);
  const suggestions = await buildSuggestions(customer, customers, session.name);

  return (
    <AppShell
      title={`${customer.firstName} ${customer.lastName}`}
      subtitle="Full biodata, note history, and AI-assisted compatibility suggestions for the selected customer."
      userName={session.name}
      userEmail={session.email}
    >
      <ProfileClient customer={customer} notes={notes} matches={matches} suggestions={suggestions} matchmakerName={session.name} />
    </AppShell>
  );
}