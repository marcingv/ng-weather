import { REQUEST_ZIPCODES } from '../fixtures/data.fixtures';

describe('Weather Conditions Page', (): void => {
  it('should initially have no user locations', (): void => {
    cy.visit('/');
    cy.get('app-tabs-view').should('not.exist');
    cy.get('app-empty-collection-placeholder');
    cy.contains('Please add locations to see weather conditions here.');
  });

  it('should redirect to root when zipcode in url is unknown', (): void => {
    cy.visit('/weather/NOT_KNOWN_ZIPCODE');
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/`);
    });
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

  it('should not allow add the same location twice', (): void => {
    cy.visit('');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@submitBtn').should('be.disabled');
    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);

    cy.get('@submitBtn').should('not.be.disabled').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').should('be.disabled');

    cy.contains('Provided zipcode is already in use.');
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
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_10001
    );

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_95742);
    cy.get('@submitBtn').click();
    cy.get('app-tab').should('exist').should('have.length', 2);
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_95742}`);
    });
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_95742
    );
  });

  it('should navigate between tabs', (): void => {
    cy.visit('');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_30002);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_95742);
    cy.get('@submitBtn').click();

    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_95742}`);
    });
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_95742
    );

    cy.get('app-tabs-navigation li:nth-child(2)').click();
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_30002
    );
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_30002}`);
    });

    cy.get('app-tabs-navigation li:nth-child(1)').click();
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_10001
    );
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_10001}`);
    });

    // Navigating back with the browser
    cy.go('back');
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_30002}`);
    });

    cy.go('back');
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_95742}`);
    });
  });

  it('should remove tabs one by one', (): void => {
    cy.visit('');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_30002);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_95742);
    cy.get('@submitBtn').click();

    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_95742}`);
    });

    cy.get('app-tabs-navigation li:nth-child(3) button').click();
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_30002}`);
    });

    cy.get('app-tabs-navigation li:nth-child(2) button').click();
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_10001}`);
    });

    cy.get('app-tabs-navigation li:nth-child(1) button').click();
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/`);
    });

    cy.get('app-tabs-view').should('not.exist');
    cy.get('app-empty-collection-placeholder');
  });

  it('should redirect user to first location by default', (): void => {
    cy.visit('/');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_30002);
    cy.get('@submitBtn').click();

    cy.visit('/');
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(`/weather/${REQUEST_ZIPCODES.ZIP_10001}`);
    });
  });

  it('should open location tab with zipcode specified in url', (): void => {
    cy.visit('/');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_30002);
    cy.get('@submitBtn').click();

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_95742);
    cy.get('@submitBtn').click();

    cy.visit(`/weather/${REQUEST_ZIPCODES.ZIP_30002}`);
    cy.get('.tabs-navigation__item.active').contains(
      REQUEST_ZIPCODES.ZIP_30002
    );
  });

  it.only('should navigate to forecast page', (): void => {
    cy.visit('/');

    cy.get('app-zipcode-entry input').as('zipcodeInput');
    cy.get('app-zipcode-entry button').as('submitBtn');

    cy.get('@zipcodeInput').type(REQUEST_ZIPCODES.ZIP_10001);
    cy.get('@submitBtn').click();

    cy.get('app-tab a').click();
    cy.location().should((location): void => {
      expect(location.pathname).to.eq(
        `/forecast/${REQUEST_ZIPCODES.ZIP_10001}`
      );
    });
  });
});
