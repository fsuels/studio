import React from 'react';
import { ClipboardEdit, Sparkles, DownloadCloud } from 'lucide-react';

export const StepOneIllustration = (
  props: React.SVGProps<SVGSVGElement>,
) => <ClipboardEdit aria-hidden="true" {...props} />;

export const StepTwoIllustration = (
  props: React.SVGProps<SVGSVGElement>,
) => <Sparkles aria-hidden="true" {...props} />;

export const StepThreeIllustration = (
  props: React.SVGProps<SVGSVGElement>,
) => <DownloadCloud aria-hidden="true" {...props} />;

