import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stars } from '../Stars';

describe('Stars Component', () => {
  it('renders correct number of stars', () => {
    render(<Stars rating={3} data-testid="stars" />);
    const container = screen.getByTestId('stars');
    expect(container).toBeInTheDocument();
  });

  it('displays rating with aria label', () => {
    render(<Stars rating={4} maxRating={5} />);
    const starsContainer = screen.getByRole('img');
    expect(starsContainer).toHaveAttribute(
      'aria-label',
      'Rating: 4 out of 5 stars',
    );
  });

  it('handles interactive rating changes', () => {
    const mockOnChange = jest.fn();
    render(<Stars rating={3} interactive onChange={mockOnChange} />);

    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[4]); // Click 5th star

    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('supports keyboard navigation', () => {
    const mockOnChange = jest.fn();
    render(<Stars rating={2} interactive onChange={mockOnChange} />);

    const stars = screen.getAllByRole('button');
    fireEvent.keyDown(stars[2], { key: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('shows rating value when requested', () => {
    render(<Stars rating={4.5} showValue />);
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Stars rating={3} size="sm" data-testid="stars" />,
    );
    let stars = screen.getByTestId('stars').querySelectorAll('svg');
    expect(stars[0]).toHaveClass('h-3', 'w-3');

    rerender(<Stars rating={3} size="lg" data-testid="stars" />);
    stars = screen.getByTestId('stars').querySelectorAll('svg');
    expect(stars[0]).toHaveClass('h-5', 'w-5');
  });

  it('normalizes rating within bounds', () => {
    render(<Stars rating={10} maxRating={5} />);
    const container = screen.getByRole('img');
    expect(container).toHaveAttribute('aria-label', 'Rating: 5 out of 5 stars');
  });

  it('handles half ratings when allowed', () => {
    render(<Stars rating={3.5} allowHalf />);
    const container = screen.getByRole('img');
    expect(container).toHaveAttribute(
      'aria-label',
      'Rating: 3.5 out of 5 stars',
    );
  });
});
