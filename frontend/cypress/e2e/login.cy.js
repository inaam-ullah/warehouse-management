describe('Login Page Tests', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the login form', () => {
      cy.get('form').should('be.visible');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });
  
    it('should login a user', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('testpassword');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
    });
  
    it('should show error on login failure', () => {
      cy.get('input[name="username"]').type('wronguser');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.MuiAlert-message').should('contain', 'Error logging in');
    });
  });
  