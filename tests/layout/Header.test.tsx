import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders branding and primary navigation links', () => {
    renderHeader();
    expect(screen.getByLabelText(/foodbridge home/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('opens and closes mobile menu drawer via menu button', async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuButton = screen.getByLabelText(/toggle navigation menu/i);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toHaveClass('translate-x-0');

    const closeButton = screen.getByLabelText(/close navigation drawer/i);
    await user.click(closeButton);
    const drawer = document.getElementById('mobile-navigation');
    expect(drawer).toHaveClass('translate-x-full');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes mobile drawer on Escape key press', async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuButton = screen.getByLabelText(/toggle navigation menu/i);
    await user.click(menuButton);

    const drawer = document.getElementById('mobile-navigation');
    expect(drawer).toHaveClass('translate-x-0');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(drawer).toHaveClass('translate-x-full');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });
});
