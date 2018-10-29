import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTextComponent } from './select-text.component';

describe('SelectTextComponent', () => {
  let component: SelectTextComponent;
  let fixture: ComponentFixture<SelectTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
