// Button.test.jsx - Unit test for Button component (expanded)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button, Input, Card } from '../../components/Button';

describe('Button Component', () => {
  // Test rendering
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
    expect(button).not.toBeDisabled();
  });

  // Test different variants
  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('btn-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('btn-secondary');
    
    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button', { name: /danger/i });
    expect(button).toHaveClass('btn-danger');
  });

  // Test different sizes
  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('btn-sm');
    
    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button', { name: /medium/i });
    expect(button).toHaveClass('btn-md');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('btn-lg');
  });

  // Test disabled state
  it('renders in disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-disabled');
  });

  // Test click handler
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test that disabled button doesn't call onClick
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test with additional props
  it('passes additional props to the button element', () => {
    render(<Button data-testid="custom-button" aria-label="Custom Button">Custom</Button>);
    const button = screen.getByTestId('custom-button');
    
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });

  // Test with custom className
  it('accepts and applies custom className', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    const button = screen.getByRole('button', { name: /custom class/i });
    
    expect(button).toHaveClass('custom-class');
    // Should also have the default classes
    expect(button).toHaveClass('btn-primary');
  });

  // Test ref forwarding
  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Button ref={ref}>Ref Test</Button>);
    
    expect(ref.current).toBeInTheDocument();
    expect(ref.current.tagName).toBe('BUTTON');
  });
});

describe('Input Component', () => {
  it('renders with label and input', () => {
    render(<Input label="Email" name="email" type="email" />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input error="Email is required" />);
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'error-message');
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="Enter a valid email" />);
    
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('applies error class when error exists', () => {
    const { container } = render(<Input error="Error message" />);
    
    const input = container.querySelector('input');
    expect(input).toHaveClass('input-error');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInTheDocument();
    expect(ref.current.tagName).toBe('INPUT');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });
});

describe('Card Component', () => {
  it('renders with children', () => {
    render(<Card>Card content</Card>);
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-card">Content</Card>
    );
    
    expect(container.firstChild).toHaveClass('card', 'custom-card');
  });

  it('passes additional props', () => {
    const { container } = render(
      <Card data-testid="test-card">Content</Card>
    );
    
    expect(container.querySelector('[data-testid="test-card"]')).toBeInTheDocument();
  });
}); 