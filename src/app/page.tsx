// app/page.tsx
import { redirect } from 'next/navigation';
import type { NextPage } from 'next';

const RootPage: NextPage = () => {
  // Redirect to the default English locale
  redirect('/en');
  // This return is technically unreachable due to redirect,
  // but included for completeness or if redirect behavior changes.
  return null; 
};

export default RootPage;
