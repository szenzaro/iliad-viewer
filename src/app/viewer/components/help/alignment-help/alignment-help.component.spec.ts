import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignmentHelpComponent } from './alignment-help.component';

describe('AlignmentHelpComponent', () => {
  let component: AlignmentHelpComponent;
  let fixture: ComponentFixture<AlignmentHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignmentHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
