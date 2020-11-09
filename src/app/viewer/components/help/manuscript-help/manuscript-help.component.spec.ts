import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptHelpComponent } from './manuscript-help.component';

describe('ManuscriptHelpComponent', () => {
  let component: ManuscriptHelpComponent;
  let fixture: ComponentFixture<ManuscriptHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuscriptHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuscriptHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
