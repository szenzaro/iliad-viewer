import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenseadragonComponent } from './openseadragon.component';

describe('OpenseadragonComponent', () => {
  let component: OpenseadragonComponent;
  let fixture: ComponentFixture<OpenseadragonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenseadragonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenseadragonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
