import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import {
  DataType,
  FilterParam,
  FilterType,
} from "src/app/services/grid.service";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.css"],
})
export class FilterComponent implements OnInit {
  constructor() {}
  selected: any;
  @Input() label: string;
  @Input() type: string = "text";
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldName = "";
  @Input() filterType: FilterType = FilterType.Equal;
  ngOnInit(): void {}

  setFilter(value: string, fieldName: string) {
    // if (value != null && Number(value) > 0) {
    var fp = new FilterParam();
    fp.FieldName = fieldName;
    fp.DataType = DataType.String;
    fp.FilterType = Number(this.filterType);
    fp.FilterValue = value;
    // }
    this.onChange.emit(fp);
    // this.applyFilters(this.filters);
  }
}