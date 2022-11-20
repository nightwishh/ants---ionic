import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SkipSelf,
} from "@angular/core";

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
  @Input() selected: any;
  @Input() label: string;
  @Input() labels: Array<string> = [];
  @Input() type: string = "text";
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldName = "";
  @Input() filterType: FilterType = FilterType.Equal;
  @Input() dataType: DataType = DataType.String;
  @Input() disabled: boolean = false;
  @Input() multipleFilter: boolean = false;

  showLabelsDropdown: boolean = false;
  @Input() selectedFilterIndex: number = 0;
  @Output() selectedFilterIndexChange: EventEmitter<any> =
    new EventEmitter<any>();

  ngOnInit(): void {}

  setFilter(value: string, fieldName: string) {
    // if (value != null && Number(value) > 0) {
    var fp = new FilterParam();
    fp.FieldName = fieldName;
    fp.DataType = this.dataType;
    fp.FilterType = Number(this.filterType);
    fp.FilterValue = value;
    // }
    this.onChange.emit(fp);
    // this.applyFilters(this.filters);
  }

  selectFilter(i) {
    this.selectedFilterIndex = i;
    this.selectedFilterIndexChange.emit(this.selectedFilterIndex);
    this.showLabelsDropdown = false;
  }
}
