import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonHelpComponent } from './comparison-help.component';

describe('ComparisonHelpComponent', () => {
  let component: ComparisonHelpComponent;
  let fixture: ComponentFixture<ComparisonHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
