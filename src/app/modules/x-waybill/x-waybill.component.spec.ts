import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { XWaybillComponent } from './x-waybill.component';

describe('XWaybillComponent', () => {
  let component: XWaybillComponent;
  let fixture: ComponentFixture<XWaybillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XWaybillComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XWaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
