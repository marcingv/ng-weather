// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

import {
  CURRENT_CONDITIONS_RESPONSES,
  REQUEST_ZIPCODES,
} from '../fixtures/current-conditions.fixtures';

beforeEach(() => {
  cy.intercept(
    {
      method: 'GET',
      url: '**/data/2.5/weather*',
    },
    req => {
      const zipQueryParam: string = req.query['zip'] + '';
      const zipQueryParamParts = zipQueryParam.split(',');
      const zipcode: REQUEST_ZIPCODES | undefined =
        zipQueryParamParts[0] as REQUEST_ZIPCODES;
      console.warn(zipcode);
      if (zipcode && CURRENT_CONDITIONS_RESPONSES[zipcode]) {
        req.reply(200, CURRENT_CONDITIONS_RESPONSES[zipcode]);
      } else {
        req.reply(404);
      }
    }
  ).as('weatherConditionsResponse');
});
