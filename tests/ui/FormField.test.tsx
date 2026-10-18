import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from '@/components/ui/FormField';

describe('FormField Component', () => {
  it('renders label linked to input element by id', () => {
    render(
      <FormField id="food-title" label="Food Title">
        {(props) => <input type="text" {...props} />}
      </FormField>
    );

    const label = screen.getByText('Food Title');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', 'food-title');
    expect(input).toHaveAttribute('id', 'food-title');
  });

  it('indicates required field with asterisk and sr-only notice', () => {
    render(
      <FormField id="servings" label="Servings" required>
        {(props) => <input type="number" {...props} />}
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Required field')).toHaveClass('sr-only');
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-required', 'true');
  });

  it('displays field error with role="alert" and sets aria-invalid', () => {
    render(
      <FormField
        id="email"
        label="Email Address"
        error="Please provide a valid email"
      >
        {(props) => <input type="email" {...props} />}
      </FormField>
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please provide a valid email');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('displays help text when there is no error', () => {
    render(
      <FormField
        id="phone"
        label="Phone Number"
        helpText="Include country code for SMS coordination"
      >
        {(props) => <input type="tel" {...props} />}
      </FormField>
    );

    expect(
      screen.getByText('Include country code for SMS coordination')
    ).toBeInTheDocument();
  });
});
