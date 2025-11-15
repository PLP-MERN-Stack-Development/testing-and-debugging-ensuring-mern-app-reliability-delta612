// error-handling.cy.js - E2E tests for error handling
describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
  });

  describe('Network Errors', () => {
    it('should show error message on network failure', () => {
      cy.intercept('GET', '/api/posts', { forceNetworkError: true });
      
      cy.visit('/posts');
      
      cy.get('.error-banner').should('contain', 'Failed to load posts');
    });

    it('should retry on network failure', () => {
      cy.intercept('GET', '/api/posts', { statusCode: 500 }).as('failedRequest');
      
      cy.visit('/posts');
      cy.get('button[aria-label="Retry"]').click();
      
      cy.wait('@failedRequest');
    });
  });

  describe('Validation Errors', () => {
    it('should show validation errors on form submit', () => {
      cy.visit('/posts/new');
      
      cy.get('input[name="title"]').type('a'); // Too short
      cy.get('button[type="submit"]').click();
      
      cy.get('.field-error[data-field="title"]').should('contain', 'must be at least 5 characters');
    });

    it('should clear errors when field is corrected', () => {
      cy.visit('/posts/new');
      
      cy.get('input[name="title"]').type('a');
      cy.get('button[type="submit"]').click();
      cy.get('.field-error[data-field="title"]').should('be.visible');
      
      cy.get('input[name="title"]').clear().type('Valid Title');
      cy.get('.field-error[data-field="title"]').should('not.exist');
    });
  });

  describe('Authorization Errors', () => {
    it('should redirect to login when session expires', () => {
      cy.visit('/posts');
      cy.intercept('GET', '/api/posts', { statusCode: 401 });
      
      cy.reload();
      
      cy.url().should('include', '/login');
    });

    it('should prevent unauthorized actions', () => {
      cy.intercept('DELETE', '/api/posts/*', { statusCode: 403 }).as('unauthorizedDelete');
      
      cy.visit('/posts/1');
      cy.get('button[aria-label="Delete post"]').click();
      cy.get('[data-testid="confirm-delete"]').click();
      
      cy.wait('@unauthorizedDelete');
      cy.get('.error-message').should('contain', 'unauthorized');
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator while fetching', () => {
      cy.intercept('GET', '/api/posts', (req) => {
        req.reply((res) => {
          res.delay(2000);
        });
      });
      
      cy.visit('/posts');
      
      cy.get('[data-testid="loading"]').should('be.visible');
      cy.get('[role="progressbar"]').should('be.visible');
    });

    it('should show loading state on form submit', () => {
      cy.visit('/posts/new');
      
      cy.get('input[name="title"]').type('New Post');
      cy.get('textarea[name="content"]').type('Content');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no posts', () => {
      cy.intercept('GET', '/api/posts', { body: [] });
      
      cy.visit('/posts');
      
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state"]').should('contain', 'No posts found');
    });

    it('should show cta in empty state', () => {
      cy.intercept('GET', '/api/posts', { body: [] });
      
      cy.visit('/posts');
      
      cy.get('[data-testid="empty-state"] a').should('contain', 'Create your first post');
    });
  });
});
