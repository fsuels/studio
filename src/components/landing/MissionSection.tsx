'use client';

import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

const MissionSection = React.memo(function MissionSection() {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const title = t('mission.title', { defaultValue: 'Our Mission' });
  const description = t('mission.description', {
    defaultValue:
      'Empowering everyone to handle legal paperwork with confidence through accessible AI-driven tools.',
  });

  return (
    <section className="bg-secondary/50 py-12 md:py-16">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          {isHydrated ? title : '...'}
        </h2>
        <p className="text-lg text-muted-foreground">
          {isHydrated ? description : '...'}
        </p>
      </div>
    </section>
  );
});

export default MissionSection;
