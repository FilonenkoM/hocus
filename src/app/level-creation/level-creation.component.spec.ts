import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCreationComponent } from './level-creation.component';

describe('LevelCreationComponent', () => {
  let component: LevelCreationComponent;
  let fixture: ComponentFixture<LevelCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
