// support/commands.js - Custom Cypress commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('button[aria-label="Logout"]').click();
  cy.url().should('include', '/login');
});

Cypress.Commands.add('createPost', (title, content) => {
  cy.visit('/posts/new');
  cy.get('input[name="title"]').type(title);
  cy.get('textarea[name="content"]').type(content);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/posts/');
});

Cypress.Commands.add('navigateToPost', (postTitle) => {
  cy.get(`[data-testid="post-item"]:contains("${postTitle}")`).click();
});
