
function setBrowserTimeForTesting () {

    // intercepting and stubbing response with prerecorded fixture file
    cy.intercept(`/v2/racing/next-races-category-group*`, { fixture: 'next-races-category-group.json' }).as(
        'getRaces'
    )
    // setting predefined epoch time to control time and environment
    cy.clock(1691049691425)
    cy.visit('/');

}

const firstRaceCountdown = `.item>p`

describe('Countdown Timer', () => {
  it('Should validate that timer is ticking down', () => {

      setBrowserTimeForTesting();

      cy.get(firstRaceCountdown).eq(0).should('have.text','28s');
      // move forward by 1 sec and verify countdown in browser
      cy.tick(1000);
      cy.get(firstRaceCountdown).eq(0).should('have.text','27s');

      // move forward by 1 sec and verify countdown in browser
      cy.tick(1000);
      cy.get(firstRaceCountdown).eq(0).should('have.text','26s');

  });

  it('Should validate that race time sign swaps to negative when expected jump time is exceeded', () => {

      setBrowserTimeForTesting();

      // verifying countdown after race time expires
      cy.get(firstRaceCountdown).eq(0).should('have.text','28s');
      cy.tick(29000);
      cy.get(firstRaceCountdown).eq(0).should('have.text','-1s');

  });

  it('Should validate that races do not display after 5 minutes past the jump', () => {

      setBrowserTimeForTesting();

      // initial race before moving time is confirmed
      cy.get(`.item`).eq(0).should('have.text','R10Redcliffe28s');
      cy.tick(329000);
      // race is removed from the top of the list after clock is forwarded 300 seconds + 29
      cy.get(`.item`).eq(0).should('not.have.text','R10Redcliffe28s');

  });

});
