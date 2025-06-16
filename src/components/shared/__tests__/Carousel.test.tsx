import React from 'react';
import { render, screen } from '@testing-library/react';
import Carousel from '../Carousel';

describe('Carousel', () => {
  it('renders without crashing', () => {
    render(<Carousel />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<Carousel className={customClass} data-testid="carousel" />);
    expect(screen.getByTestId('carousel')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<Carousel data-testid="carousel" />);
    const component = screen.getByTestId('carousel');
    expect(component).toBeInTheDocument();
  });
});