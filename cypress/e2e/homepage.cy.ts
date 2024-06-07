describe('Home Page Test', (): void => {
  it('Visits the initial project page', (): void => {
    cy.visit('/');
    cy.contains('NgWeather App - Marcin Gawski');
  });

  it('Should navigate user to /weather/ route by default', (): void => {
    cy.visit('/');
    cy.location().should((location): void => {
      expect(location.pathname).to.eq('/weather/');
    });
  });
});
