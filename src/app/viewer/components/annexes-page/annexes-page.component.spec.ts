import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesPageComponent } from './annexes-page.component';

describe('AnnexesPageComponent', () => {
  let component: AnnexesPageComponent;
  let fixture: ComponentFixture<AnnexesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
