import React from 'react';

/**
 * Error Boundary component for catching React errors
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // In production, send error to logging service
    console.log('Logging error to service:', { error, errorInfo });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            margin: '20px',
            border: '2px solid red',
            borderRadius: '8px',
            backgroundColor: '#fee',
          }}
          role="alert"
        >
          <h2>Something went wrong</h2>
          <details
            style={{
              whiteSpace: 'pre-wrap',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fdd',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Error count: {this.state.errorCount}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error reporting service
 */
export class ErrorReporter {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ErrorReporter();
    }
    return this.instance;
  }

  errors = [];

  reportError(error, context = {}) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    };

    this.errors.push(errorReport);
    console.error('Error reported:', errorReport);

    // Send to logging service
    this.sendToServer(errorReport);
  }

  sendToServer(errorReport) {
    if (typeof window !== 'undefined') {
      // In production, send to error tracking service
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(err => console.error('Failed to report error:', err));
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

export default ErrorBoundary;
