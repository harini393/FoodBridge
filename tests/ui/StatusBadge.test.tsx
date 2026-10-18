import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders pendingReview status badge correctly', () => {
    render(<StatusBadge status="pendingReview" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Pending Review');
    expect(badge).toHaveClass('text-[#946200]');
  });

  it('renders approved status badge correctly', () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Approved');
    expect(badge).toHaveClass('text-forest');
  });

  it('renders delivered status badge correctly', () => {
    render(<StatusBadge status="delivered" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Delivered');
    expect(badge).toHaveClass('text-status-success');
  });

  it('renders rejected status badge with error styling', () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Rejected');
    expect(badge).toHaveClass('text-status-error');
  });

  it('renders custom label when provided', () => {
    render(<StatusBadge status="active" customLabel="Verified Partner" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Verified Partner');
  });
});
