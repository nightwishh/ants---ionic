import { TestBed } from "@angular/core/testing";

import { XWaybillService } from "./x-waybill.service";

fdescribe("XWaybillService", () => {
  let service: XWaybillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XWaybillService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
