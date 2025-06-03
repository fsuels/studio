'use client';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

const MissionSection = React.memo(function MissionSection() {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholder = '...';

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {isHydrated ? t('mission.title', { defaultValue: 'Our Mission' }) : placeholder}
        </h2>
        <p className="text-lg text-muted-foreground">
          {isHydrated
            ? t('mission.body', {
                defaultValue:
                  '123LegalDoc empowers everyone to handle routine legal needs quickly and confidently by blending attorney insight with intuitive AI.',
              })
            : placeholder}
        </p>
      </div>
    </section>
  );
});

export { MissionSection };
