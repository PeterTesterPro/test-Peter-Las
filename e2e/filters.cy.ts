import {
  CATEGORY_ID_GREYHOUND,
  CATEGORY_ID_HARNESS,
  CATEGORY_ID_THOROUGHBRED,
  filterCheckbox
} from "../config/constants";
import {getRacesList, interceptRacesListCall, checkAPIRacesvsDisplayed} from "../pageobjects/pageObjects.cy";

describe('Category Filters', () => {

  beforeEach(() => {

    interceptRacesListCall();

    cy.visit('/');

  })

  it('Should validate that all checkboxes are checked by default and correctly react to check / uncheck actions', () => {

    for (let counter = 0; counter < 3; counter++) {
      cy.get(filterCheckbox).eq(counter).should('be.checked');
      cy.get(filterCheckbox).eq(counter).uncheck();
      cy.get(filterCheckbox).eq(counter).should('be.not.checked');
      cy.get(filterCheckbox).eq(counter).check();
      cy.get(filterCheckbox).eq(counter).should('be.checked');
    }

  });

  it('Should validate that unchecking all checkboxes re-enables all', () => {

    cy.get(filterCheckbox).eq(0).uncheck();
    cy.get(filterCheckbox).eq(1).uncheck();
    cy.get(filterCheckbox).eq(2).uncheck();
    cy.get(filterCheckbox).eq(0).should('be.checked');
    cy.get(filterCheckbox).eq(1).should('be.checked');
    cy.get(filterCheckbox).eq(2).should('be.checked');

  });

  it('Should validate that selecting only one category "Thoroughbred" shows correct races', () => {

    // uncheck two other categories
    cy.get(filterCheckbox).eq(1).uncheck();
    cy.get(filterCheckbox).eq(2).uncheck();

    // wait for fetching current race data
    cy.wait('@getRaces').then((data) => {

      const racesList = getRacesList(data);

      let racesFiltered = [];
      for(let raceNumber = 0; raceNumber < racesList.length; raceNumber++) {
        if ((racesList[raceNumber][1] == CATEGORY_ID_THOROUGHBRED)) {
          racesFiltered.push(racesList[raceNumber]);
        }

      }

      checkAPIRacesvsDisplayed (racesFiltered);

    })

  });

  it('Should validate that selecting only one category "Greyhound" shows correct races', () => {

    // uncheck two other categories
    cy.get(filterCheckbox).eq(0).uncheck();
    cy.get(filterCheckbox).eq(2).uncheck();

    // wait for fetching current race data
    cy.wait('@getRaces').then((data) => {

      const racesList = getRacesList(data);

      let racesFiltered = [];
      for(let raceNumber = 0; raceNumber < racesList.length; raceNumber++) {
        if ((racesList[raceNumber][1] == CATEGORY_ID_GREYHOUND)) {
          racesFiltered.push(racesList[raceNumber]);
        }

      }

      checkAPIRacesvsDisplayed (racesFiltered);

    })

  });

  it('Should validate that selecting only one category "Greyhound" shows correct races', () => {

    // uncheck two other categories
    cy.get(filterCheckbox).eq(0).uncheck();
    cy.get(filterCheckbox).eq(1).uncheck();

    // wait for fetching current race data
    cy.wait('@getRaces').then((data) => {

      const racesList = getRacesList(data);

      let racesFiltered = [];
      for(let raceNumber = 0; raceNumber < racesList.length; raceNumber++) {
        if ((racesList[raceNumber][1] == CATEGORY_ID_HARNESS)) {
          racesFiltered.push(racesList[raceNumber]);
        }

      }

      checkAPIRacesvsDisplayed (racesFiltered);

    })

  });




});
