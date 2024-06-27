import { mockUser, mockItems } from '../mockData';

Cypress.Commands.add('login', () => {
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: mockUser
  }).as('login');

  cy.visit('/login');
  cy.get('input[name="username"]').type(mockUser.username);
  cy.get('input[name="password"]').type('testpassword');
  cy.get('button[type="submit"]').click();
  cy.wait('@login');
  cy.url().should('include', '/');
});

Cypress.Commands.add('mockItemsApi', () => {
  cy.intercept('GET', '/api/items', {
    statusCode: 200,
    body: mockItems
  }).as('getItems');

  cy.intercept('GET', '/api/items/itemid1', {
    statusCode: 200,
    body: mockItems[0]
  }).as('getItemById');
});
