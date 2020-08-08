import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBitrixComponent } from './auth-bitrix.component';

describe('AuthBitrixComponent', () => {
  let component: AuthBitrixComponent;
  let fixture: ComponentFixture<AuthBitrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthBitrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBitrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
