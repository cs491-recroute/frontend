/// <reference types="cypress" />
/// <reference types="../support" />

describe('Flows page', () => {
    before(() => {
        cy.loginAndVisit('/flows');
    })
  
    it('can see all flows', () => {
        cy.getByTestID('flows-loading').should('not.exist');

        cy.fixture('flows').then(flows => {
            cy.getByTestID('flowList').within(() => {
                flows.forEach(flow => {
                    cy.getByTestID(`${flow.name}-card`).should('be.visible');
                })
            })
        })
    })

    it('can create and delete a flow', () => {
        const flowName = 'Test Flow';
        cy.getByTestID(`${flowName}-card`).should('not.exist');
        cy.getByTestID('create-flow-modal').should('not.exist');

        // Open modal
        cy.getByTestID('create-flow-button').click();
        cy.getByTestID('create-flow-modal').should('be.visible');

        // Create flow
        cy.getByTestID('create-flow-modal-name').type(flowName);
        cy.getByTestID('create-flow-modal-button').click();
        cy.getByTestID(`${flowName}-card`).should('be.visible');

        // Delete flow
        cy.getByTestID(`${flowName}-delete`).click();
        cy.getByTestID('approve-confirmation-button').click();
        cy.getByTestID(`${flowName}-card`).should('not.exist');
    })

})
