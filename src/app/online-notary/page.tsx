import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Online Notary',
};

export default function OnlineNotaryPage() {
  redirect('/en/online-notary');
  return null;
}
