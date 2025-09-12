import React from 'react';
import { Star } from 'lucide-react';
import {
  BaseComponentProps,
  ClassNameHelpers,
  AccessibilityHelpers,
  setDisplayName,
} from '@/lib/component-standards';

export interface StarsProps extends BaseComponentProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  allowHalf?: boolean;
  color?: 'yellow' | 'orange' | 'red';
  variant?: 'filled' | 'outlined';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const SIZE_CLASSES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

const COLOR_CLASSES = {
  yellow: {
    filled: 'text-yellow-400 fill-yellow-400',
    empty: 'text-gray-300 fill-gray-300',
  },
  orange: {
    filled: 'text-orange-400 fill-orange-400',
    empty: 'text-gray-300 fill-gray-300',
  },
  red: {
    filled: 'text-red-400 fill-red-400',
    empty: 'text-gray-300 fill-gray-300',
  },
} as const;

const Stars = React.memo<StarsProps>(function Stars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  allowHalf = false,
  color = 'yellow',
  variant: _variant = 'filled',
  interactive = false,
  onChange,
  className,
  id,
  'data-testid': testId,
  ...rest
}) {
  const normalizedRating = Math.max(0, Math.min(maxRating, rating));
  const roundedRating = allowHalf
    ? Math.round(normalizedRating * 2) / 2
    : Math.round(normalizedRating);

  const handleStarClick = (starIndex: number) => {
    if (interactive && onChange) {
      onChange(starIndex + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, starIndex: number) => {
    if (interactive && onChange) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onChange(starIndex + 1);
      }
    }
  };

  const starsArray = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= roundedRating;
    const isHalfFilled = allowHalf && starValue - 0.5 === roundedRating;

    return {
      id: `star-${index}`,
      index,
      isFilled,
      isHalfFilled,
      value: starValue,
    };
  });

  const containerClasses = ClassNameHelpers.cn(
    'flex items-center gap-0.5',
    className,
  );

  const starClasses = (isFilled: boolean, isHalfFilled: boolean) =>
    ClassNameHelpers.cn(
      SIZE_CLASSES[size],
      isFilled || isHalfFilled
        ? COLOR_CLASSES[color].filled
        : COLOR_CLASSES[color].empty,
      interactive && 'cursor-pointer hover:scale-110 transition-transform',
      'star-gradient',
    );

  const ariaProps = {
    role: 'img',
    'aria-label': `Rating: ${normalizedRating} out of ${maxRating} stars`,
    ...AccessibilityHelpers.getInteractiveAria({
      disabled: !interactive,
    }),
  };

  return (
    <div
      className={containerClasses}
      id={id}
      data-testid={testId || 'stars-rating'}
      {...ariaProps}
      {...rest}
    >
      {starsArray.map(
        ({ id: starId, index, isFilled, isHalfFilled, value }) => (
          <Star
            key={starId}
            className={starClasses(isFilled, isHalfFilled)}
            onClick={() => handleStarClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={interactive ? 0 : -1}
            role={interactive ? 'button' : undefined}
            aria-label={
              interactive
                ? `Rate ${value} star${value !== 1 ? 's' : ''}`
                : undefined
            }
          />
        ),
      )}

      {showValue && (
        <span className="ml-2 text-sm text-gray-600" aria-hidden="true">
          ({normalizedRating})
        </span>
      )}
    </div>
  );
});

export default setDisplayName(Stars, 'Stars');
