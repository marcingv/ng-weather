import { REQUEST_ZIPCODES } from '../fixtures/data.fixtures';

describe('Forecast Details Page', (): void => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_30002);
    cy.get('@submitBtn').click();
  });

  it('should not allow to see forecast for not added locations', () => {
    cy.visit('/forecast/UNKNOWN_ZIPCODE');

    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_10001}`);
    });
  });

  it('should display forecast page for user location', () => {
    cy.visit(`/forecast/${REQUEST_ZIPCODES.ZIP_30002}`);

    cy.get('app-forecast-details-page');
    cy.get('app-forecasts-list');
    cy.contains(REQUEST_ZIPCODES.ZIP_30002);
  });

  it('should navigate from forecast to current weather after "go back" btn click', () => {
    cy.visit(`/forecast/${REQUEST_ZIPCODES.ZIP_30002}`);

    cy.get('app-forecast-details-page');
    cy.get('app-forecasts-list');
    cy.get('app-back-button').click();

    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_30002}`);
    });
  });
});
