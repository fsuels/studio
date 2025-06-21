import React from 'react';
import { Review } from '@/types';
import Stars from './Stars';
import {
  CardComponentProps,
  ClassNameHelpers,
  setDisplayName,
} from '@/lib/component-standards';

export interface ReviewCardProps
  extends Omit<CardComponentProps, 'title' | 'description'> {
  review: Review;
  size?: 'sm' | 'md' | 'lg';
  showStars?: boolean;
  showLocation?: boolean;
  maxQuoteLength?: number;
}

const SIZE_CLASSES = {
  sm: 'px-4 py-4 text-sm',
  md: 'px-6 py-8 text-base',
  lg: 'px-8 py-10 text-lg',
} as const;

const ReviewCard = React.memo<ReviewCardProps>(function ReviewCard({
  review,
  size = 'md',
  variant = 'outlined',
  showStars = true,
  showLocation = true,
  maxQuoteLength,
  clickable = false,
  onClick,
  className,
  id,
  'data-testid': testId,
  ...rest
}) {
  const truncatedQuote =
    maxQuoteLength && review.quote.length > maxQuoteLength
      ? `${review.quote.substring(0, maxQuoteLength)}...`
      : review.quote;

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    outlined: 'bg-white border border-gray-300 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-md',
    flat: 'bg-gray-50 border-0',
  };

  const containerClasses = ClassNameHelpers.cn(
    'flex h-full flex-col items-center rounded-lg text-center transition-all duration-200',
    SIZE_CLASSES[size],
    variantClasses[variant],
    clickable && 'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
    className,
  );

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const reviewerName = review.name || 'Anonymous';
  const reviewLocation =
    showLocation && review.location ? review.location : null;

  return (
    <article
      className={containerClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      id={id}
      data-testid={testId || 'review-card'}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? `Review by ${reviewerName}` : undefined}
      {...rest}
    >
      {/* Rating Stars */}
      {showStars && (
        <div className="mb-4">
          <Stars
            rating={review.rating || 5}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            data-testid="review-rating"
          />
        </div>
      )}

      {/* Review Quote */}
      <blockquote className="flex-1 my-4 italic leading-relaxed text-gray-800">
        <p>"{truncatedQuote}"</p>
      </blockquote>

      {/* Reviewer Information */}
      <footer className="mt-auto">
        <cite className="font-semibold text-gray-900 not-italic">
          {reviewerName}
        </cite>

        {reviewLocation && (
          <p className="mt-1 text-sm text-gray-500">{reviewLocation}</p>
        )}

        {/* Review Date if available */}
        {review.date && (
          <time
            dateTime={review.date}
            className="mt-1 text-xs text-gray-400 block"
          >
            {new Date(review.date).toLocaleDateString()}
          </time>
        )}
      </footer>
    </article>
  );
});

export default setDisplayName(ReviewCard, 'ReviewCard');
