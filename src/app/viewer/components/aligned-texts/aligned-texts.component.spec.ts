import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignedTextsComponent } from './aligned-texts.component';

describe('AlignedTextsComponent', () => {
  let component: AlignedTextsComponent;
  let fixture: ComponentFixture<AlignedTextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignedTextsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
