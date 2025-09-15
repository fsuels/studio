// src/app/[locale]/support/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, HelpCircle, LifeBuoy } from 'lucide-react';

interface SupportPageProps {
  params: Promise<{ locale: 'en' | 'es' } & Record<string, string>>;
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params;
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">
        {t('Support', 'Soporte')}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        {t('How can we help you?', '¿Cómo podemos ayudarte?')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-xl bg-card border border-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-semibold text-card-foreground">
                {t('Contact Us', 'Contáctanos')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" /> support@123legaldoc.com
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> {t('Mon–Fri, 9am–6pm (ET)', 'Lun–Vie, 9am–6pm (ET)')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-card border border-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <LifeBuoy className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-semibold text-card-foreground">
                {t('Help Topics', 'Temas de Ayuda')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground list-none space-y-2">
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('Account & billing', 'Cuenta y facturación')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('Using templates', 'Uso de plantillas')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('Editing documents', 'Edición de documentos')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('Privacy & security', 'Privacidad y seguridad')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center bg-secondary/50 p-6 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">📌 {t('Check our FAQ for quick answers.', 'Consulta nuestras Preguntas Frecuentes.')}</p>
        <a href={`/${locale}/faq`} className="inline-block text-primary hover:underline text-sm font-medium">
          {t('Go to FAQ →', 'Ir a FAQ →')}
        </a>
      </div>
    </main>
  );
}
