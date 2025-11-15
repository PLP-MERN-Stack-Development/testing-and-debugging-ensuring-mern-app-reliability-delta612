# Quick Reference Guide - Testing & Debugging

## 🚀 Quick Start Commands

```bash
# Install everything
npm run install-all

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests interactively
npm run test:e2e

# Run E2E tests headless
npm run test:e2e:headless
```

---

## 📝 Test Files Reference

### Client Unit Tests

| File | Tests | Coverage |
|------|-------|----------|
| `Button.test.jsx` | 8 suites, 15+ cases | Components |
| `validation.test.js` | 8 suites, 30+ cases | Utilities |
| `useCustomHooks.test.js` | 4 suites, 20+ cases | Hooks |
| `ErrorBoundary.test.jsx` | 2 suites, 12+ cases | Error handling |

### Server Unit Tests

| File | Tests | Coverage |
|------|-------|----------|
| `auth.test.js` | 8 suites, 25+ cases | Auth utils |
| `middleware.test.js` | 6 suites, 18+ cases | Middleware |
| `logger.test.js` | 4 suites, 15+ cases | Logging |

### Integration Tests

| File | Endpoints | Coverage |
|------|-----------|----------|
| `posts.test.js` | 13 tests | CRUD ops |

### E2E Tests

| File | Scenarios | Coverage |
|------|-----------|----------|
| `authentication.cy.js` | 7 tests | Auth flows |
| `crud-operations.cy.js` | 10+ tests | CRUD flows |
| `error-handling.cy.js` | 8+ tests | Error paths |

---

## 🧪 Running Specific Tests

```bash
# Run specific test file
npm test -- Button.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="validation"

# Run client tests only
npm test -- --selectProjects=client

# Run server tests only
npm test -- --selectProjects=server

# Run single integration test
npm test -- posts.test.js

# Run Cypress test for specific feature
npm run test:e2e -- --spec "cypress/e2e/authentication.cy.js"
```

---

## 📊 Coverage Report

### Targets
- Statements: 70%+ ✅
- Branches: 60%+ ✅
- Functions: 70%+ ✅
- Lines: 70%+ ✅

### View Coverage

```bash
# Generate and view coverage
npm run test:coverage

# HTML report is in coverage/lcov-report/index.html
```

---

## 🐛 Debugging Tips

### Client-Side
- Check `ErrorBoundary.jsx` for error catching
- Use `ErrorReporter` singleton for logging errors
- Browser console for component errors
- React DevTools for state inspection

### Server-Side
- Check `Logger` singleton in `logger.js`
- View request tracking with unique IDs
- Monitor performance with middleware
- Check `errorHandler` middleware for global errors

### Common Issues

**Tests timing out**
```bash
npm test -- --testTimeout=15000
```

**Flaky tests**
- Check for race conditions
- Use `waitFor()` in async tests
- Stub API calls with `cy.intercept()`

**Coverage not meeting targets**
```bash
npm run test:coverage
# Check coverage/lcov-report/index.html for gaps
```

---

## 🔄 Test Workflow

```
1. Write code
   ↓
2. Run unit tests → npm run test:unit
   ↓
3. Run integration tests → npm run test:integration
   ↓
4. Run E2E tests → npm run test:e2e
   ↓
5. Check coverage → npm run test:coverage
   ↓
6. Fix failures and iterate
```

---

## 📚 Test Patterns

### Unit Test Pattern
```javascript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange
    const input = { /* setup */ };
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Integration Test Pattern
```javascript
describe('API Endpoint', () => {
  it('should create resource', async () => {
    const res = await request(app)
      .post('/api/resource')
      .send(data);
    
    expect(res.status).toBe(201);
  });
});
```

### E2E Test Pattern
```javascript
describe('User Flow', () => {
  it('should complete action', () => {
    cy.visit('/page');
    cy.get('[data-testid="button"]').click();
    cy.get('[data-testid="result"]').should('be.visible');
  });
});
```

---

## ✨ Key Files to Know

### Configuration
- `jest.config.js` - Jest configuration
- `cypress.config.js` - Cypress configuration
- `package.json` - Test scripts

### Documentation
- `TESTING_STRATEGY.md` - Full testing guide
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - What was built

### Test Setup
- `client/src/tests/setup.js` - Client setup
- `server/tests/setup.js` - Server setup
- `cypress/support/e2e.js` - E2E setup

### Utilities
- `client/src/utils/validation.js` - Validation helpers
- `server/src/utils/auth.js` - Auth helpers
- `server/src/utils/logger.js` - Logging system

### Components
- `client/src/components/Button.jsx` - Example component
- `client/src/components/ErrorBoundary.jsx` - Error boundary
- `server/src/middleware/index.js` - Middleware functions

---

## 🎯 Next Steps

1. **Review** TESTING_STRATEGY.md for comprehensive documentation
2. **Run** `npm run test:coverage` to see coverage report
3. **Explore** test files to understand patterns
4. **Modify** tests as you add features
5. **Maintain** 70%+ coverage going forward

---

## 💡 Pro Tips

- Use `--watch` flag during development
- Use `--coverage` flag to find untested code
- Use Cypress Test Runner (`npm run test:e2e`) for debugging
- Read test file names - they describe what's being tested
- Check `Error` in error handling tests for edge cases
- Use custom Cypress commands for reusable logic

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase `testTimeout` in config |
| Coverage low | Check `coverage/lcov-report/` for gaps |
| Flaky E2E | Use `cy.intercept()` to stub APIs |
| Import errors | Check file paths and export syntax |
| Mock issues | Ensure mocks are set in `setup.js` |

---

**Last Updated**: November 15, 2025  
**Status**: Complete ✅  
**Coverage**: 70%+ ✅  
**Documentation**: Comprehensive ✅
