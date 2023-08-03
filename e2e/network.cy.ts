
describe('Simulation of different network cases', () => {
    it('Simulation of server error', () => {

        // returning false here prevents Cypress from failing the test due to app under test error
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })

        // intercepting and stubbing response status code 500
        cy.intercept(`/v2/racing/next-races-category-group*`, { statusCode: 500 }).as('getRaces')

        cy.visit('/');

        // loading spinner is displayed on the page
        cy.get('.loading-spinner').should('be.visible');

    });

});