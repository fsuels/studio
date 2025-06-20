// UI Polish Demo Page
import { Metadata } from 'next';
import UIPolishShowcase from '@/components/demo/UIPolishShowcase';

export const metadata: Metadata = {
  title: 'UI Polish Demo - Admin Dashboard',
  description: 'Interactive demonstration of Quick-Win UI polish features including sticky summary bars, inline actions, skeleton loaders, and optimistic updates',
};

export default function UIPolishDemoPage() {
  return <UIPolishShowcase />;
}