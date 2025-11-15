# MERN Stack Application - Comprehensive Testing & Debugging

This is a complete MERN (MongoDB, Express, React, Node.js) stack application with comprehensive testing strategies and debugging techniques implemented across all layers.

## 🎯 Overview

The application demonstrates:
- **Unit Testing**: Jest with React Testing Library for components and utilities
- **Integration Testing**: Supertest for API endpoints with MongoDB Memory Server
- **End-to-End Testing**: Cypress for critical user flows
- **Debugging Techniques**: Error boundaries, logging, error handlers, and performance monitoring
- **Code Coverage**: 70%+ coverage across the application

## 📋 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── hooks/
│   │   │   └── useCustomHooks.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   └── tests/
│   │       ├── setup.js
│   │       ├── __mocks__/
│   │       │   └── fileMock.js
│   │       └── unit/
│   │           ├── Button.test.jsx
│   │           ├── validation.test.js
│   │           ├── useCustomHooks.test.js
│   │           └── ErrorBoundary.test.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── index.js
│   │   └── utils/
│   │       ├── auth.js
│   │       └── logger.js
│   ├── tests/
│   │   ├── setup.js
│   │   ├── unit/
│   │   │   ├── auth.test.js
│   │   │   ├── middleware.test.js
│   │   │   └── logger.test.js
│   │   └── integration/
│   │       └── posts.test.js
│   └── package.json
├── cypress/
│   ├── e2e/
│   │   ├── authentication.cy.js
│   │   ├── crud-operations.cy.js
│   │   └── error-handling.cy.js
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── jest.config.js
├── cypress.config.js
├── TESTING_STRATEGY.md
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install all dependencies (client, server, and root)
npm run install-all

# Or manually:
npm install
npm install --prefix client
npm install --prefix server
```

### Running Tests

```bash
# Run all tests (unit, integration, E2E)
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests (interactive)
npm run test:e2e

# Run E2E tests headless
npm run test:e2e:headless

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run all test types (sequential)
npm run test:all
```

## 🧪 Testing Details

### Unit Tests

**Framework**: Jest + React Testing Library

**Coverage**:
- Client components (Button, Input, Card)
- Custom hooks (useForm, useAsync, useDebounce, useLocalStorage)
- Utility functions (validation, formatting, calculations)
- Middleware functions
- Authentication utilities
- Logger and error handling

**Running Unit Tests**:
```bash
npm run test:unit
```

**Examples**:
- `client/src/tests/unit/Button.test.jsx` - Component testing
- `client/src/tests/unit/validation.test.js` - Utility testing
- `server/tests/unit/middleware.test.js` - Middleware testing

### Integration Tests

**Framework**: Supertest + MongoDB Memory Server

**Coverage**:
- API endpoints (GET, POST, PUT, DELETE)
- Database operations
- Authentication flows
- Validation and error handling
- Pagination and filtering

**Running Integration Tests**:
```bash
npm run test:integration
```

**Example**: `server/tests/integration/posts.test.js`
- POST endpoint creation with auth
- GET endpoints with filtering
- PUT updates with authorization
- DELETE operations

### End-to-End Tests

**Framework**: Cypress

**Coverage**:
- User registration and login
- CRUD operations
- Error handling and validation
- Navigation and routing
- Loading and empty states

**Running E2E Tests**:
```bash
# Interactive mode
npm run test:e2e

# Headless mode
npm run test:e2e:headless

# Specific test file
npm run test:e2e -- --spec "cypress/e2e/authentication.cy.js"
```

**Test Suites**:
- `authentication.cy.js` - Registration, login, logout flows
- `crud-operations.cy.js` - Create, read, update, delete operations
- `error-handling.cy.js` - Error states and edge cases

## 🐛 Debugging Features

### Client-Side Debugging

1. **Error Boundaries**
   - Catches React errors and displays fallback UI
   - Location: `client/src/components/ErrorBoundary.jsx`
   - Features:
     - Error message display
     - Stack trace in development
     - Error count tracking
     - Reset functionality

2. **Error Reporter**
   - Global error tracking singleton
   - Logs errors with context (user, URL, timestamp)
   - Sends errors to logging service

3. **Custom Hooks with Debug Support**
   - Form state management with error tracking
   - Async operations with status management
   - Local storage persistence
   - Debouncing for performance

### Server-Side Debugging

1. **Logger System**
   - Location: `server/src/utils/logger.js`
   - Log levels: INFO, WARN, ERROR, DEBUG
   - Timestamp and context tracking
   - Error log filtering

2. **Request Tracking**
   - Unique request IDs
   - Request context middleware
   - Performance monitoring
   - Slow request detection (>1000ms)

3. **Middleware**
   - Authentication middleware with error handling
   - Request validation middleware
   - CORS middleware with debugging
   - Rate limiting with diagnostics

4. **Global Error Handler**
   - Catches unhandled rejections
   - Catches uncaught exceptions
   - Stack traces in development
   - Graceful error responses

## 📊 Code Coverage

### Coverage Targets
- Statements: 70%+
- Branches: 60%+
- Functions: 70%+
- Lines: 70%+

### Generate Coverage Report
```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory with HTML reports in `coverage/lcov-report/`.

## 📖 Documentation

See `TESTING_STRATEGY.md` for comprehensive documentation including:
- Detailed testing architecture
- Test file descriptions
- Best practices
- Troubleshooting guide
- CI/CD integration
- Coverage goals and metrics

## 🔧 Key Testing Utilities

### Client
- **useForm**: Form state management with validation
- **useAsync**: Async operations handling
- **useDebounce**: Value debouncing
- **useLocalStorage**: localStorage integration
- **validateEmail, validatePassword**: Validation functions
- **ErrorBoundary**: Error catching component

### Server
- **Logger**: Centralized logging system
- **authMiddleware**: Authentication checking
- **validateRequest**: Request validation
- **rateLimit**: Rate limiting
- **errorHandler**: Global error handling
- **performanceMonitoring**: Request tracking

## 🎯 Assignment Completion

This project fulfills all requirements from the Week 6 assignment:

✅ **Task 1: Setting Up Testing Environment**
- Jest configured for client and server
- React Testing Library set up
- Supertest for API testing
- MongoDB Memory Server for test database
- Test scripts in package.json

✅ **Task 2: Unit Testing**
- Components, hooks, utilities tested
- Middleware tested
- Auth utilities tested
- 70%+ code coverage achieved

✅ **Task 3: Integration Testing**
- API endpoints fully tested
- Database operations tested
- Authentication flows tested
- Validation tested

✅ **Task 4: End-to-End Testing**
- Cypress configured
- Critical user flows tested
- Error handling tested
- Navigation tested

✅ **Task 5: Debugging Techniques**
- Logging strategies implemented
- Error boundaries in React
- Global error handler in Express
- Performance monitoring

## 📝 Example Test Commands

```bash
# Run all tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- validation.test.js

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run server tests only
npm test server

# Run client tests only
npm test client

# Watch for changes
npm test -- --watch

# Update snapshots
npm test -- --updateSnapshot
```

## 🚦 Continuous Integration

To set up CI/CD, create `.github/workflows/test.yml` with the provided configuration in `TESTING_STRATEGY.md`.

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

This assignment focuses on implementing comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, along with debugging techniques.

## Assignment Overview

You will:
1. Set up testing environments for both client and server
2. Write unit tests for React components and server functions
3. Implement integration tests for API endpoints
4. Create end-to-end tests for critical user flows
5. Apply debugging techniques for common MERN stack issues

## Project Structure

```
mern-testing/
├── client/                 # React front-end
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx         # Main application component
│   └── cypress/            # End-to-end tests
├── server/                 # Express.js back-end
│   ├── src/                # Server source code
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── tests/              # Server-side tests
│       ├── unit/           # Unit tests
│       └── integration/    # Integration tests
├── jest.config.js          # Jest configuration
└── package.json            # Project dependencies
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week6-Assignment.md` file
4. Explore the starter code and existing tests
5. Complete the tasks outlined in the assignment

## Files Included

- `Week6-Assignment.md`: Detailed assignment instructions
- Starter code for a MERN application with basic test setup:
  - Sample React components with test files
  - Express routes with test files
  - Jest and testing library configurations
  - Example tests for reference

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Basic understanding of testing concepts

## Testing Tools

- Jest: JavaScript testing framework
- React Testing Library: Testing utilities for React
- Supertest: HTTP assertions for API testing
- Cypress/Playwright: End-to-end testing framework
- MongoDB Memory Server: In-memory MongoDB for testing

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all required tests (unit, integration, and end-to-end)
2. Achieve at least 70% code coverage for unit tests
3. Document your testing strategy in the README.md
4. Include screenshots of your test coverage reports
5. Demonstrate debugging techniques in your code

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices) 