import { redirect } from 'next/navigation'

interface PageProps {
  params: { locale: string }
}

export default function LegacyDocumentsIndex({ params }: PageProps) {
  redirect(`/${params.locale}/docs`)
}
