import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChevronUpComponent } from './chevron-up.component';

describe('ChevronUpComponent', () => {
  let component: ChevronUpComponent;
  let fixture: ComponentFixture<ChevronUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChevronUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChevronUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
