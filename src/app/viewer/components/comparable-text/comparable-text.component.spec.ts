import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparableTextComponent } from './comparable-text.component';

describe('ComparableTextComponent', () => {
  let component: ComparableTextComponent;
  let fixture: ComponentFixture<ComparableTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparableTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
