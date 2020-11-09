import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlinearTextComponent } from './interlinear-text.component';

describe('InterlinearTextComponent', () => {
  let component: InterlinearTextComponent;
  let fixture: ComponentFixture<InterlinearTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterlinearTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterlinearTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
