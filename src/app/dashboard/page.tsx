// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default function DashboardRedirectPage() {
  redirect('/en/dashboard');
  return null;
}
