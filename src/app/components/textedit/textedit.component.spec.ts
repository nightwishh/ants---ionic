import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TexteditComponent } from './textedit.component';

describe('TexteditComponent', () => {
  let component: TexteditComponent;
  let fixture: ComponentFixture<TexteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TexteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TexteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
