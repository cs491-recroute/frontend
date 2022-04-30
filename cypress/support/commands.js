Cypress.Commands.add('loginAndVisit', path => {
    cy.fixture('users').then(function (data) {
        const { email, password } = data[0];
        cy.visit(`/api/auth/login?returnTo=${path}`);
        cy.location('hostname').then(hostname => {
            if (hostname !== 'localhost') {
                cy.get('#username').type(email);
                cy.get('#password').type(password);
                cy.get('form').submit();
            }
        });
    })
})

Cypress.Commands.add('getByTestID', testID => {
    return cy.get(`[data-testid="${testID}"]`);
})
