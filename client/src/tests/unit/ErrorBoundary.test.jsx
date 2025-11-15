// ErrorBoundary.test.jsx - Tests for Error Boundary component
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ErrorBoundary, { ErrorReporter } from '../../components/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that doesn't throw
const SafeComponent = () => <div>Safe component</div>;

describe('ErrorBoundary Component', () => {
  // Suppress console errors for tests
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children without error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe component')).toBeInTheDocument();
  });

  it('should catch errors in children', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  it('should have a reset button', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const resetButton = screen.getByText('Try Again');
    expect(resetButton).toBeInTheDocument();

    // After clicking reset, it should still show the error
    // (because the component still throws)
    userEvent.click(resetButton);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should increment error count', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Error count: 1/)).toBeInTheDocument();
  });

  it('should show details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Error count:/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});

describe('ErrorReporter', () => {
  let errorReporter;

  beforeEach(() => {
    errorReporter = ErrorReporter.getInstance();
    errorReporter.clearErrors();
  });

  it('should create a singleton instance', () => {
    const instance1 = ErrorReporter.getInstance();
    const instance2 = ErrorReporter.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should report errors', () => {
    const error = new Error('Test error');
    const context = { userId: '123' };

    errorReporter.reportError(error, context);

    expect(errorReporter.getErrors().length).toBe(1);
    expect(errorReporter.getErrors()[0].message).toBe('Test error');
    expect(errorReporter.getErrors()[0].context).toEqual(context);
  });

  it('should include timestamp in error report', () => {
    const error = new Error('Test error');
    errorReporter.reportError(error);

    const reportedError = errorReporter.getErrors()[0];
    expect(reportedError.timestamp).toBeTruthy();
  });

  it('should store multiple errors', () => {
    const error1 = new Error('Error 1');
    const error2 = new Error('Error 2');

    errorReporter.reportError(error1);
    errorReporter.reportError(error2);

    expect(errorReporter.getErrors().length).toBe(2);
  });

  it('should clear errors', () => {
    const error = new Error('Test error');
    errorReporter.reportError(error);

    expect(errorReporter.getErrors().length).toBe(1);

    errorReporter.clearErrors();

    expect(errorReporter.getErrors().length).toBe(0);
  });
});
