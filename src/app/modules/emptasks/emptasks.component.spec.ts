import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptasksComponent } from './emptasks.component';

describe('EmptasksComponent', () => {
  let component: EmptasksComponent;
  let fixture: ComponentFixture<EmptasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
