import { Component, OnInit } from "@angular/core";
import { XWaybillService } from "./x-waybill.service";

@Component({
  selector: "app-x-waybill",
  templateUrl: "./x-waybill.component.html",
  styleUrls: ["./x-waybill.component.css"],
})
export class XWaybillComponent implements OnInit {
  constructor(private wservice: XWaybillService) {}

  ngOnInit() {
    this.wservice.GetWaybills().subscribe((x) => {
      console.log(x);
    });
  }
}
