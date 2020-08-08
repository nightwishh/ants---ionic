import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrdUsersComponent } from './grd-users.component';

describe('GrdUsersComponent', () => {
  let component: GrdUsersComponent;
  let fixture: ComponentFixture<GrdUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrdUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrdUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
