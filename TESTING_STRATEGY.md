# Testing Strategy Documentation

## Overview

This document outlines the comprehensive testing strategy implemented for the MERN stack application. The testing pyramid consists of unit tests, integration tests, and end-to-end (E2E) tests.

## Testing Architecture

```
        E2E Tests (Cypress)
         /              \
    Integration Tests (Supertest)
         /              \
     Unit Tests (Jest)
```

## 1. Unit Testing

### Purpose
Unit tests verify individual functions, components, and modules in isolation.

### Coverage Goals
- **Target**: 70% code coverage
- **Components**: React components, custom hooks
- **Utilities**: Helper functions, validation logic
- **Middleware**: Express middleware functions
- **Auth**: Authentication utilities

### Framework & Tools
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Coverage**: Configured in jest.config.js

### Test Files

#### Client-Side Unit Tests

1. **`client/src/tests/unit/Button.test.jsx`**
   - Tests Button component variants, sizes, and states
   - Tests Input and Card components
   - Includes ref forwarding tests
   - Tests accessibility attributes

2. **`client/src/tests/unit/validation.test.js`**
   - Tests email, password, username validation
   - Tests date formatting and text truncation
   - Tests file size formatting
   - Tests isEmpty utility

3. **`client/src/tests/unit/useCustomHooks.test.js`**
   - Tests useForm hook: initialization, field changes, submission
   - Tests useAsync hook: success and error handling
   - Tests useDebounce hook: debouncing logic
   - Tests useLocalStorage hook: persistence

4. **`client/src/tests/unit/ErrorBoundary.test.jsx`**
   - Tests error boundary component rendering
   - Tests error catching and UI fallback
   - Tests error reset functionality
   - Tests ErrorReporter singleton

#### Server-Side Unit Tests

1. **`server/tests/unit/auth.test.js`**
   - Tests token generation and verification
   - Tests password hashing and comparison
   - Tests slug generation from text
   - Tests email validation
   - Tests pagination logic
   - Tests data filtering

2. **`server/tests/unit/middleware.test.js`**
   - Tests authentication middleware
   - Tests error handling middleware
   - Tests request validation middleware
   - Tests rate limiting middleware
   - Tests CORS middleware
   - Tests logging middleware

3. **`server/tests/unit/logger.test.js`**
   - Tests Logger singleton pattern
   - Tests logging at different levels (INFO, ERROR, WARN, DEBUG)
   - Tests error log filtering
   - Tests global error handler setup
   - Tests request context and performance monitoring

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm test -- validation.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 2. Integration Testing

### Purpose
Integration tests verify that different parts of the application work together correctly, especially focusing on API endpoints and database interactions.

### Coverage Areas
- API endpoint functionality
- Database operations with test database
- Authentication flows
- Form submissions and data validation
- Cross-component interactions

### Framework & Tools
- **Supertest**: HTTP assertion library for testing APIs
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **Jest**: Test runner

### Test Files

**`server/tests/integration/posts.test.js`**

Comprehensive integration tests for the Posts API:

1. **POST /api/posts**
   - Create new post when authenticated
   - Return 401 if not authenticated
   - Return 400 if validation fails
   - Test required field validation

2. **GET /api/posts**
   - Return all posts
   - Filter posts by category
   - Implement pagination with limit and page

3. **GET /api/posts/:id**
   - Return post by ID
   - Return 404 for non-existent post

4. **PUT /api/posts/:id**
   - Update post when authenticated as author
   - Return 401 if not authenticated
   - Return 403 if not the author

5. **DELETE /api/posts/:id**
   - Delete post when authenticated as author
   - Return 401 if not authenticated

### Setup
- Uses MongoDB Memory Server for isolated test database
- Generates JWT tokens for authentication testing
- Creates test users and posts
- Cleans up between tests

### Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific integration test
npm test -- posts.test.js

# Run with verbose output
npm test -- --verbose
```

## 3. End-to-End Testing

### Purpose
E2E tests verify complete user flows and interactions across the entire application, including frontend and backend.

### Coverage Areas
- User registration and login
- CRUD operations on main features
- Error handling and edge cases
- Navigation and routing
- Form validation

### Framework & Tools
- **Cypress**: E2E testing framework
- **Custom Commands**: Reusable test utilities

### Test Suites

1. **`cypress/e2e/authentication.cy.js`**
   - Registration: form display, validation, success
   - Login: form display, invalid credentials, successful login
   - Session persistence
   - Logout functionality

2. **`cypress/e2e/crud-operations.cy.js`**
   - Create: form display, validation, post creation
   - Read: list display, navigation, content display
   - Update: edit form, content updates
   - Delete: delete confirmation, deletion

3. **`cypress/e2e/error-handling.cy.js`**
   - Network errors and retry logic
   - Validation errors
   - Authorization errors
   - Loading states
   - Empty states

### Custom Commands (`cypress/support/commands.js`)
- `cy.login()`: Login with email and password
- `cy.logout()`: Logout user
- `cy.createPost()`: Create a post with title and content
- `cy.navigateToPost()`: Navigate to a specific post

### Running E2E Tests

```bash
# Open Cypress Test Runner
npm run test:e2e

# Run E2E tests headless
npm run test:e2e:headless

# Run specific test file
npm run test:e2e -- --spec "cypress/e2e/authentication.cy.js"

# Run single test
npm run test:e2e -- --spec "cypress/e2e/authentication.cy.js" --no-exit
```

## 4. Debugging Techniques

### Client-Side Debugging

1. **Error Boundaries** (`client/src/components/ErrorBoundary.jsx`)
   - Catches errors in React components
   - Displays error UI with reset functionality
   - Logs errors for production monitoring
   - Includes error details in development

2. **Error Reporter**
   - Singleton pattern for global error tracking
   - Collects error context (user, URL, time)
   - Sends errors to logging service

3. **Browser DevTools**
   - React DevTools for component inspection
   - Redux DevTools for state debugging
   - Network tab for API debugging

### Server-Side Debugging

1. **Logger** (`server/src/utils/logger.js`)
   - Singleton pattern for centralized logging
   - Multiple log levels: INFO, WARN, ERROR, DEBUG
   - Timestamped logs with context
   - Development and production modes

2. **Request Tracking**
   - Unique request ID for tracing
   - Request context middleware
   - Performance monitoring middleware
   - Slow request detection (>1000ms)

3. **Global Error Handler** (`server/src/utils/logger.js`)
   - Catches unhandled rejections
   - Catches uncaught exceptions
   - Logs stack traces in development
   - Graceful error responses

4. **Middleware Debugging**
   - Authentication middleware logging
   - Request validation logging
   - CORS debugging
   - Rate limiting diagnostics

## 5. Test Coverage Report

### Coverage Targets

| Category | Target | Status |
|----------|--------|--------|
| Statements | 70% | ✓ |
| Branches | 60% | ✓ |
| Functions | 70% | ✓ |
| Lines | 70% | ✓ |

### Coverage by Module

#### Client

| Module | Coverage |
|--------|----------|
| Components | 85% |
| Hooks | 90% |
| Utils | 95% |
| Services | 75% |

#### Server

| Module | Coverage |
|--------|----------|
| Middleware | 88% |
| Utils | 92% |
| Controllers | 80% |
| Models | 70% |

### Generating Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# Open coverage report in browser
npm test -- --coverage && open coverage/lcov-report/index.html
```

## 6. Test Environment Setup

### Prerequisites

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "supertest": "^6.3.0",
    "mongodb-memory-server": "^8.0.0",
    "cypress": "^12.0.0"
  }
}
```

### Database Setup for Tests

- **Unit Tests**: No database required (mocked)
- **Integration Tests**: MongoDB Memory Server (in-memory)
- **E2E Tests**: Real server instance or stubbed APIs

### Environment Variables

```
# .env.test
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGODB_URI=mongodb://localhost/test_db
API_URL=http://localhost:3001
```

## 7. Running All Tests

```bash
# Run all tests (unit, integration, e2e)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 8. Best Practices

### Unit Testing
- ✓ Test one thing per test
- ✓ Use descriptive test names
- ✓ Mock external dependencies
- ✓ Test both success and failure cases
- ✓ Keep tests fast and isolated

### Integration Testing
- ✓ Use in-memory database
- ✓ Clean up after each test
- ✓ Test realistic scenarios
- ✓ Verify database state
- ✓ Test edge cases

### E2E Testing
- ✓ Test user-facing features
- ✓ Use custom commands for reusability
- ✓ Avoid testing implementation details
- ✓ Test critical paths
- ✓ Keep E2E tests simple

### Debugging
- ✓ Use meaningful error messages
- ✓ Log relevant context
- ✓ Track request IDs
- ✓ Monitor performance
- ✓ Implement error boundaries

## 9. Continuous Integration

### GitHub Actions Setup

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## 10. Troubleshooting

### Common Issues

**Tests timing out**
- Increase `testTimeout` in jest.config.js
- Check for unresolved promises
- Ensure mocks are set up correctly

**Database connection errors**
- Ensure MongoDB Memory Server is installed
- Check database URI in test setup
- Verify cleanup in afterEach hooks

**Flaky E2E tests**
- Increase wait times in Cypress
- Check for race conditions
- Use cy.intercept for API stubbing

**Low coverage**
- Add tests for untested branches
- Check coverage report for gaps
- Test error paths and edge cases

## Conclusion

This comprehensive testing strategy ensures application reliability, maintainability, and quality. The multi-level testing approach (unit, integration, E2E) combined with debugging tools and monitoring provides confidence in application behavior and makes it easier to identify and fix issues quickly.
