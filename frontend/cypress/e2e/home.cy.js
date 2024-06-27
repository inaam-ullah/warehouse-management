describe('Home Page Tests', () => {
    beforeEach(() => {
      // Log in before accessing the home page
      cy.visit('/login');
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('testpassword');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
    });
  
    it('should display the home page with items', () => {
      cy.get('h4').should('contain', 'Warehouse Items');
      cy.get('[data-testid="add-item-button"]').should('be.visible');
      cy.get('[data-testid="add-location-button"]').should('be.visible');
    });
  
    it('should navigate to add new item page', () => {
      cy.get('[data-testid="add-item-button"]').click();
      cy.url().should('include', '/items/new');
    });
  
    it('should navigate to add new location page', () => {
      cy.get('[data-testid="add-location-button"]').click();
      cy.url().should('include', '/locations/new');
    });
});
  