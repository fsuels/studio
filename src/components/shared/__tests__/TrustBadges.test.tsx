import React from 'react';
import { render, screen } from '@testing-library/react';
import TrustBadges from '../TrustBadges';

describe('TrustBadges', () => {
  it('renders without crashing', () => {
    render(<TrustBadges />);
    expect(screen.getByTestId('trustbadges')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<TrustBadges className={customClass} data-testid="trustbadges" />);
    expect(screen.getByTestId('trustbadges')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<TrustBadges data-testid="trustbadges" />);
    const component = screen.getByTestId('trustbadges');
    expect(component).toBeInTheDocument();
  });
});
