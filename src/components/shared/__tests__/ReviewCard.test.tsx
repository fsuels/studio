import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewCard } from '../ReviewCard';
import { Review } from '@/types';

const mockReview: Review = {
  id: '1',
  name: 'John Doe',
  rating: 5,
  quote: 'This is an excellent service!',
  location: 'New York, NY',
  date: '2024-01-15',
};

describe('ReviewCard Component', () => {
  it('renders review information correctly', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.getByText('"This is an excellent service!"'),
    ).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });

  it('displays star rating by default', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByTestId('review-rating')).toBeInTheDocument();
  });

  it('can hide star rating when requested', () => {
    render(<ReviewCard review={mockReview} showStars={false} />);
    expect(screen.queryByTestId('review-rating')).not.toBeInTheDocument();
  });

  it('can hide location when requested', () => {
    render(<ReviewCard review={mockReview} showLocation={false} />);
    expect(screen.queryByText('New York, NY')).not.toBeInTheDocument();
  });

  it('truncates long quotes when maxQuoteLength is set', () => {
    const longQuote =
      'This is a very long review that should be truncated at some point';
    const reviewWithLongQuote = { ...mockReview, quote: longQuote };

    render(<ReviewCard review={reviewWithLongQuote} maxQuoteLength={20} />);
    expect(screen.getByText(/"This is a very long .../)).toBeInTheDocument();
  });

  it('handles anonymous reviewers', () => {
    const anonymousReview = { ...mockReview, name: '' };
    render(<ReviewCard review={anonymousReview} />);
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  it('displays review date when available', () => {
    render(<ReviewCard review={mockReview} />);
    const dateElement = screen.getByText('1/15/2024');
    expect(dateElement).toBeInTheDocument();
    expect(dateElement.tagName).toBe('TIME');
  });

  it('applies correct size variants', () => {
    const { rerender } = render(
      <ReviewCard review={mockReview} size="sm" data-testid="review-card" />,
    );
    let card = screen.getByTestId('review-card');
    expect(card).toHaveClass('px-4', 'py-4', 'text-sm');

    rerender(
      <ReviewCard review={mockReview} size="lg" data-testid="review-card" />,
    );
    card = screen.getByTestId('review-card');
    expect(card).toHaveClass('px-8', 'py-10', 'text-lg');
  });

  it('handles click interactions when clickable', () => {
    const mockOnClick = jest.fn();
    render(<ReviewCard review={mockReview} clickable onClick={mockOnClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('supports keyboard navigation when clickable', () => {
    const mockOnClick = jest.fn();
    render(<ReviewCard review={mockReview} clickable onClick={mockOnClick} />);

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('applies correct accessibility attributes', () => {
    render(<ReviewCard review={mockReview} clickable />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Review by John Doe');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(
      <ReviewCard
        review={mockReview}
        variant="elevated"
        data-testid="review-card"
      />,
    );
    let card = screen.getByTestId('review-card');
    expect(card).toHaveClass('shadow-md');

    rerender(
      <ReviewCard
        review={mockReview}
        variant="flat"
        data-testid="review-card"
      />,
    );
    card = screen.getByTestId('review-card');
    expect(card).toHaveClass('bg-gray-50', 'border-0');
  });
});
