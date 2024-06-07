import { REQUEST_ZIPCODES } from '../fixtures/current-conditions.fixtures';

describe('Weather Conditions Page', (): void => {
  it('should initially have no user locations', (): void => {
    cy.visit('/');
    cy.get('app-tabs-view').should('not.exist');
    cy.get('app-empty-collection-placeholder');
    cy.contains('Please add locations to see weather conditions here.');
  });

  it('should add first location', (): void => {
    cy.visit('');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@submitBtn').should('be.disabled');
    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);

    cy.get('@submitBtn').should('not.be.disabled').click();

    cy.get('app-tabs-view').should('exist');
    cy.get('app-tab').should('exist').should('have.length', 1);
  });

  it('should add many locations', (): void => {
    cy.visit('');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();
    cy.get('app-tab').should('exist').should('have.length', 1);
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_10001}`);
    });

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_95742);
    cy.get('@submitBtn').click();
    cy.get('app-tab').should('exist').should('have.length', 2);
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_95742}`);
    });
  });
});
