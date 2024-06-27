describe('Register Page Tests', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('should display the register form', () => {
      cy.get('form').should('be.visible');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Register');
    });
  
    it('should register a new user', () => {
      const uniqueUsername = `newtestuser_${Date.now()}`;
      cy.get('input[name="username"]').type(uniqueUsername);
      cy.get('input[name="password"]').type('newtestpassword');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/login');
    });
  
    it('should show error on registration failure', () => {
      // Assuming the user 'testuser' already exists
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('testpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.MuiAlert-message').should('contain', 'Error registering');
    });
  });
  