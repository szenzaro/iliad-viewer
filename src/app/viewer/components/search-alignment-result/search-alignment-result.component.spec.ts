import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAlignmentResultComponent } from './search-alignment-result.component';

describe('SearchAlignmentResultComponent', () => {
  let component: SearchAlignmentResultComponent;
  let fixture: ComponentFixture<SearchAlignmentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAlignmentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAlignmentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
