// crud-operations.cy.js - E2E tests for CRUD operations
describe('CRUD Operations', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/posts');
  });

  describe('Create', () => {
    it('should display create post form', () => {
      cy.get('a[href="/posts/new"]').click();
      
      cy.url().should('include', '/posts/new');
      cy.get('form').should('be.visible');
      cy.get('input[name="title"]').should('be.visible');
      cy.get('textarea[name="content"]').should('be.visible');
    });

    it('should create a new post', () => {
      cy.get('a[href="/posts/new"]').click();
      
      cy.get('input[name="title"]').type('My New Post');
      cy.get('textarea[name="content"]').type('This is the content of my post');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/posts/');
      cy.get('.success-message').should('contain', 'created successfully');
      cy.get('h1').should('contain', 'My New Post');
    });

    it('should validate required fields on create', () => {
      cy.get('a[href="/posts/new"]').click();
      cy.get('button[type="submit"]').click();
      
      cy.get('.error-message').should('be.visible');
    });
  });

  describe('Read', () => {
    it('should display list of posts', () => {
      cy.get('[data-testid="post-list"]').should('be.visible');
      cy.get('[data-testid="post-item"]').should('have.length.greaterThan', 0);
    });

    it('should navigate to post detail', () => {
      cy.get('[data-testid="post-item"]').first().click();
      
      cy.url().should('include', '/posts/');
      cy.get('article').should('be.visible');
    });

    it('should display post content', () => {
      cy.get('[data-testid="post-item"]').first().click();
      
      cy.get('h1').should('not.be.empty');
      cy.get('article p').should('not.be.empty');
    });
  });

  describe('Update', () => {
    it('should edit a post', () => {
      cy.get('[data-testid="post-item"]').first().click();
      cy.get('a[aria-label="Edit post"]').click();
      
      cy.url().should('include', '/posts/').and('include', '/edit');
      cy.get('form').should('be.visible');
    });

    it('should update post content', () => {
      cy.get('[data-testid="post-item"]').first().click();
      cy.get('a[aria-label="Edit post"]').click();
      
      cy.get('input[name="title"]').clear().type('Updated Title');
      cy.get('button[type="submit"]').click();
      
      cy.get('.success-message').should('contain', 'updated successfully');
      cy.get('h1').should('contain', 'Updated Title');
    });
  });

  describe('Delete', () => {
    it('should delete a post', () => {
      cy.get('[data-testid="post-item"]').first().click();
      cy.get('button[aria-label="Delete post"]').click();
      
      cy.get('[data-testid="confirm-delete"]').click();
      
      cy.url().should('include', '/posts');
      cy.get('.success-message').should('contain', 'deleted successfully');
    });

    it('should show confirmation before delete', () => {
      cy.get('[data-testid="post-item"]').first().click();
      cy.get('button[aria-label="Delete post"]').click();
      
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[role="dialog"]').should('contain', 'Are you sure');
    });
  });
});
