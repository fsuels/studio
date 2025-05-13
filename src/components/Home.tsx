import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t, ready } = useTranslation(['common', 'home', 'translation']);
  const documentCount = 4808; // Replace with your state or API call

  const translations = useMemo(
    () => ({
      trustStripTitle: t('home.trustStrip.title', { ns: 'home' }),
      trustStripBadge1: t('home.trustStrip.badge1', { ns: 'home', count: documentCount }),
      testimonialsTitle: t('home.testimonials.title', { ns: 'home' }),
      moneyBackGuarantee: t('home.moneyBackGuarantee', { ns: 'home' }),
      callToAction: t('home.callToAction', { ns: 'home' }),
      heroTitle: t('home.hero.title', { ns: 'home' }),
      heroSubtitle: t('home.hero.subtitle', { ns: 'home' }),
      heroPricingBadge: t('home.hero.pricingBadge', { ns: 'home' }),
    }),
    [t, documentCount]
  );

  if (!ready) {
    return <div>{t('translation:Loading...')}</div>;
  }

  return (
    <div>
      <h1>{translations.heroTitle}</h1>
      <p>{translations.heroSubtitle}</p>
      <p>{translations.heroPricingBadge}</p>
      <h2>{translations.trustStripTitle}</h2>
      <p>{translations.trustStripBadge1}</p>
      <h2>{translations.testimonialsTitle}</h2>
      <p>{translations.moneyBackGuarantee}</p>
      <button>{translations.callToAction}</button>
      <p>{t('ctaPrimary')}</p>
    </div>
  );
};

export default React.memo(Home);
