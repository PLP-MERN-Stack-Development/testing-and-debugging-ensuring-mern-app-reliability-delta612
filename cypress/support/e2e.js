// support/e2e.js - Support file for E2E tests
import './commands';

// Disable uncaught exception handling in tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

beforeEach(() => {
  // Clear local storage before each test
  cy.clearLocalStorage();
  // Clear cookies before each test
  cy.clearCookies();
});
