import { redirect } from 'next/navigation'

interface PageProps {
  params: { locale: string; docId: string }
}

export default function LegacyStartPage({ params }: PageProps) {
  const { locale, docId } = params
  redirect(`/${locale}/docs/${docId}/start`)
}
