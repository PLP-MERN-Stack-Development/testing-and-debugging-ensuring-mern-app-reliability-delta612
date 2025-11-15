// authentication.cy.js - E2E tests for authentication flows
describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Registration', () => {
    it('should display registration form', () => {
      cy.visit('/register');
      
      cy.get('form').should('be.visible');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Register');
    });

    it('should validate required fields', () => {
      cy.visit('/register');
      
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/register');
      
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[name="email"]').parent().should('have.class', 'error');
    });

    it('should successfully register with valid data', () => {
      cy.visit('/register');
      
      cy.get('input[name="username"]').type('newuser');
      cy.get('input[name="email"]').type('newuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/login');
      cy.get('.success-message').should('contain', 'registered successfully');
    });
  });

  describe('Login', () => {
    it('should display login form', () => {
      cy.visit('/login');
      
      cy.get('form').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      
      cy.get('input[name="email"]').type('user@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('.error-message').should('contain', 'Invalid credentials');
    });

    it('should successfully login with valid credentials', () => {
      cy.visit('/login');
      
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard');
      cy.get('nav').should('contain', 'Logout');
    });

    it('should persist session after login', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard');
      
      cy.reload();
      cy.url().should('include', '/dashboard');
      cy.get('nav').should('contain', 'Logout');
    });
  });

  describe('Logout', () => {
    it('should logout user', () => {
      cy.login('test@example.com', 'password123');
      
      cy.get('button[aria-label="Logout"]').click();
      
      cy.url().should('include', '/login');
      cy.get('.success-message').should('contain', 'logged out');
    });
  });
});
