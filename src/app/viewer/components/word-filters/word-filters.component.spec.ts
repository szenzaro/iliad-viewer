import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFiltersComponent } from './word-filters.component';

describe('WordFiltersComponent', () => {
  let component: WordFiltersComponent;
  let fixture: ComponentFixture<WordFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
