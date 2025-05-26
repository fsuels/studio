'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <Loader2
      className={cn('h-6 w-6 animate-spin text-primary', className)}
      {...props}
    />
  );
}
