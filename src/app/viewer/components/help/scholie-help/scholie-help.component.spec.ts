import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholieHelpComponent } from './scholie-help.component';

describe('ScholieHelpComponent', () => {
  let component: ScholieHelpComponent;
  let fixture: ComponentFixture<ScholieHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholieHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholieHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
