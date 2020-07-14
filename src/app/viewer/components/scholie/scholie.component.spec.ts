import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholieComponent } from './scholie.component';

describe('ScholieComponent', () => {
  let component: ScholieComponent;
  let fixture: ComponentFixture<ScholieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
