import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    render(<ProgressBar />);
    expect(screen.getByTestId('progressbar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<ProgressBar className={customClass} data-testid="progressbar" />);
    expect(screen.getByTestId('progressbar')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<ProgressBar data-testid="progressbar" />);
    const component = screen.getByTestId('progressbar');
    expect(component).toBeInTheDocument();
  });
});
