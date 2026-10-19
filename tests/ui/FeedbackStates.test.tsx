import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  LoadingState,
  Skeleton,
  EmptyState,
  ErrorState,
} from '@/components/ui/FeedbackStates';

describe('FeedbackStates Components', () => {
  describe('LoadingState', () => {
    it('renders default loading message with role="status"', () => {
      render(<LoadingState />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getAllByText('Loading...').length).toBeGreaterThanOrEqual(1);
    });

    it('renders custom loading message', () => {
      render(<LoadingState message="Fetching available donations..." />);
      expect(screen.getAllByText('Fetching available donations...').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Skeleton', () => {
    it('renders skeleton placeholder with aria-hidden', () => {
      const { container } = render(<Skeleton className="h-6 w-32" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });

  describe('EmptyState', () => {
    it('renders empty title, description, and action button', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="No Donations Found"
          description="There are currently no active food donations scheduled."
          action={{
            label: 'Submit First Donation',
            onClick: handleClick,
          }}
        />
      );

      expect(screen.getByText('No Donations Found')).toBeInTheDocument();
      expect(
        screen.getByText('There are currently no active food donations scheduled.')
      ).toBeInTheDocument();

      const actionBtn = screen.getByRole('button', { name: /submit first donation/i });
      expect(actionBtn).toBeInTheDocument();

      await user.click(actionBtn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorState', () => {
    it('renders error message with role="alert" and retry button', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorState
          title="Network Connection Failed"
          message="Unable to reach the coordination server. Please verify your connection."
          onRetry={handleRetry}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Network Connection Failed')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Unable to reach the coordination server. Please verify your connection.'
        )
      ).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /try again/i });
      expect(retryBtn).toBeInTheDocument();

      await user.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
