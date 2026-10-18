import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/public/HomePage';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  it('renders Hero section with headline, CTA, and hero image', () => {
    renderHomePage();

    // Check Hero headline
    const headline = screen.getByRole('heading', {
      name: /bridging surplus food to communities in need/i,
      level: 1,
    });
    expect(headline).toBeInTheDocument();

    // Check Call To Action
    const cta = screen.getByRole('link', { name: /get started with foodbridge/i });
    expect(cta).toBeInTheDocument();

    // Check Hero image with descriptive alt text
    const heroImg = screen.getByAltText(/volunteers and coordinators packing boxes of fresh wholesome produce/i);
    expect(heroImg).toBeInTheDocument();
  });

  it('renders How It Works with three coordinated stages', () => {
    renderHomePage();

    expect(screen.getByRole('heading', { name: /three transparent steps/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /donor submits surplus food/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ngo reviews & plans recipient/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /volunteer collects & delivers/i })).toBeInTheDocument();
  });

  it('renders Who Can Participate participant cards', () => {
    renderHomePage();

    expect(screen.getByRole('heading', { name: /food donors/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /verified ngos/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /volunteer couriers/i, level: 3 })).toBeInTheDocument();
  });

  it('renders Food Safety & Responsibility section', () => {
    renderHomePage();

    expect(screen.getByRole('heading', { name: /safety standards without compromise/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /strict time windows/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /packaging integrity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /allergen declarations/i })).toBeInTheDocument();
  });

  it('renders FAQs and toggles accordion items', async () => {
    const user = userEvent.setup();
    renderHomePage();

    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();

    // First FAQ starts open by default
    const firstFaqBtn = screen.getByRole('button', { name: /how does someone donate food on foodbridge\?/i });
    expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    await user.click(firstFaqBtn);
    expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'false');

    // Second FAQ can be expanded
    const secondFaqBtn = screen.getByRole('button', { name: /what specific food safety information is required\?/i });
    expect(secondFaqBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(secondFaqBtn);
    expect(secondFaqBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/donors must declare the exact preparation time/i)).toBeInTheDocument();
  });
});
