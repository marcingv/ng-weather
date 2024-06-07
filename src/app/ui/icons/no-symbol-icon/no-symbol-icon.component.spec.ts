import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoSymbolIconComponent } from './no-symbol-icon.component';

describe('NoSymbolIconComponent', () => {
  let component: NoSymbolIconComponent;
  let fixture: ComponentFixture<NoSymbolIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoSymbolIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoSymbolIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
