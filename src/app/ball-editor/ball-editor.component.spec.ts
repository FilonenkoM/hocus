import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallEditorComponent } from './ball-editor.component';

describe('BallEditorComponent', () => {
  let component: BallEditorComponent;
  let fixture: ComponentFixture<BallEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
