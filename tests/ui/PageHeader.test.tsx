import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/components/ui/PageHeader';

describe('PageHeader Component', () => {
  it('renders title and description', () => {
    render(
      <PageHeader
        title="Donation Coordination"
        description="Review incoming food donations from local partners."
      />
    );

    expect(
      screen.getByRole('heading', { name: /donation coordination/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Review incoming food donations from local partners.')
    ).toBeInTheDocument();
  });

  it('renders badge and actions when provided', () => {
    render(
      <PageHeader
        title="Active Missions"
        badge={<span data-testid="test-badge">Live</span>}
        actions={<button type="button">Create Mission</button>}
      />
    );

    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create mission/i })
    ).toBeInTheDocument();
  });
});
