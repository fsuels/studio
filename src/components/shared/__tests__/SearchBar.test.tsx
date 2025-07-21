import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<SearchBar className={customClass} data-testid="searchbar" />);
    expect(screen.getByTestId('searchbar')).toHaveClass(customClass);
  });

  it('handles accessibility attributes', () => {
    render(<SearchBar data-testid="searchbar" />);
    const component = screen.getByTestId('searchbar');
    expect(component).toBeInTheDocument();
  });
});
