import { RACING_CATEGORIES } from "../config/constants";
import {getRacesList, interceptRacesListCall, checkAPIRacesvsDisplayed} from "../pageobjects/pageObjects.cy";

describe('Page Content', () => {

  beforeEach(() => {

    interceptRacesListCall();

    cy.visit('/');

  })

  it('Should correctly display page title', () => {

    cy.get('[data-testid="page-title"]').should('have.text','Next To Go Races')

  });

  it('Should correctly display race types labels', () => {

    for (const racingcategory of RACING_CATEGORIES) {
      cy.get(`[data-testid="category-filter-${racingcategory.categoryId}"]`).should('have.text',racingcategory.name);
    }

  })

  it('Should display expected values for race row contents for the default state with all filters selected', () => {


    // wait for fetching current race data
    cy.wait('@getRaces').then((data) => {

      const racesList = getRacesList(data);

      checkAPIRacesvsDisplayed (racesList);

    })

  });

});
