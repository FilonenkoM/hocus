import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeIndicatorComponent } from './cube-indicator.component';

describe('CubeIndicatorComponent', () => {
  let component: CubeIndicatorComponent;
  let fixture: ComponentFixture<CubeIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubeIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
