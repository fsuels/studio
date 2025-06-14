// src/app/generate/page.tsx
import { redirect } from 'next/navigation';

export default function GenerateRedirectPage() {
  redirect('/en/generate');
  return null;
}