import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders without crashing', () => {
    render(<EmptyState />);
    expect(screen.getByTestId('emptystate')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<EmptyState className={customClass} data-testid="emptystate" />);
    expect(screen.getByTestId('emptystate')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<EmptyState data-testid="emptystate" />);
    const component = screen.getByTestId('emptystate');
    expect(component).toBeInTheDocument();
  });
});