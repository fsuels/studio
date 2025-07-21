import { render, screen } from '@testing-library/react';
import WizardProgress from '../WizardProgress';

describe('WizardProgress', () => {
  it('renders progress bar when totalSteps > 0', () => {
    render(<WizardProgress progress={50} totalSteps={4} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-label', 'Progress');

    const progressText = screen.getByText('50% Complete');
    expect(progressText).toBeInTheDocument();
  });

  it('does not render when totalSteps is 0', () => {
    render(<WizardProgress progress={100} totalSteps={0} />);

    const progressBar = screen.queryByRole('progressbar');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('rounds progress percentage correctly', () => {
    render(<WizardProgress progress={33.333} totalSteps={3} />);

    const progressText = screen.getByText('33% Complete');
    expect(progressText).toBeInTheDocument();
  });

  it('handles 100% progress', () => {
    render(<WizardProgress progress={100} totalSteps={2} />);

    const progressText = screen.getByText('100% Complete');
    expect(progressText).toBeInTheDocument();
  });
});
