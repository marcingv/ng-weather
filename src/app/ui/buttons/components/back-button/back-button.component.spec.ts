import { TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import Spy = jasmine.Spy;

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let harness: RouterTestingHarness;

  let button: DebugElement;
  let router: Router;
  let location: Location;
  let routerNavigateSpy: Spy;
  let locationBackSpy: Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonComponent],
      providers: [
        provideRouter([
          {
            path: 'different/path',
            children: [],
          },
          {
            path: 'some',
            children: [
              {
                path: 'example',
                children: [
                  {
                    path: 'path',
                    component: BackButtonComponent,
                  },
                ],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    routerNavigateSpy = spyOn(router, 'navigate');
    locationBackSpy = spyOn(location, 'back');

    harness = await RouterTestingHarness.create('/some/example/path');
    component = await harness.navigateByUrl(
      '/some/example/path',
      BackButtonComponent
    );

    button = harness.fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the "back" button', () => {
    expect(button).toBeTruthy();
  });

  it('should use "one level up navigation" when previous URL is not set', () => {
    button.triggerEventHandler('click');

    expect(routerNavigateSpy).toHaveBeenCalled();
    expect(locationBackSpy).not.toHaveBeenCalled();
  });

  it('should use "location back navigation" when previous URL is the parent of current URL', async () => {
    await harness.navigateByUrl('/some/example');

    component = await harness.navigateByUrl(
      '/some/example/path',
      BackButtonComponent
    );

    button = harness.fixture.debugElement.query(By.css('button'));

    expect(button).toBeTruthy();
    button.triggerEventHandler('click');

    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(locationBackSpy).toHaveBeenCalled();
  });

  it('should NOT use "location back navigation" when previous URL is not a parent of the current URL', async () => {
    await harness.navigateByUrl('/different/path');

    component = await harness.navigateByUrl(
      '/some/example/path',
      BackButtonComponent
    );

    button = harness.fixture.debugElement.query(By.css('button'));

    expect(button).toBeTruthy();
    button.triggerEventHandler('click');

    expect(routerNavigateSpy).toHaveBeenCalled();
    expect(locationBackSpy).not.toHaveBeenCalled();
  });
});
