/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get by test id
       * @example
       *  cy.getByTestID('test')
       */
      getByTestID(string): Chainable<any>
    }
  }