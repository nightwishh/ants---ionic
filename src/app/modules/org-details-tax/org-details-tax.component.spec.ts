import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrgDetailsTaxComponent } from "./org-details-tax.component";

describe("OrgDetailsComponent", () => {
  let component: OrgDetailsTaxComponent;
  let fixture: ComponentFixture<OrgDetailsTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrgDetailsTaxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDetailsTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
