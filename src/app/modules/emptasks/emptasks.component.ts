import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
import {
  DataType,
  FilterParam,
  FilterType,
} from "src/app/services/grid.service";
import {
  IClientCompany,
  ICommonTask,
  IStatus,
  ITask,
  ITaskCategory,
} from "./models/emptasks";

@Component({
  templateUrl: "./emptasks.component.html",
  styleUrls: ["./emptasks.component.css"],
})
export class EmptasksComponent implements OnInit {
  constructor(private empTasksService: EmpTasksService) {}
  statuses: IStatus[];
  tasks$: Observable<ITask[]> = this.empTasksService.GetEmpTasks();
  Tasks: ITask[] = [];
  vx: number = 0;
  clientCompanies$: Observable<
    IClientCompany[]
  > = this.empTasksService.GetClientCompanies();
  categories$: Observable<
    ITaskCategory[]
  > = this.empTasksService.GetCategories();
  commonTasks: string[] = [];

  YearRange: [{}] = [{}];
  filters: Array<FilterParam> = [];
  selectedCategory: number = 0;
  leftHeadersShown: boolean = false;
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  noDataFound: boolean = false;
  loading: boolean = true;
  ngOnInit(): void {
    this.YearRange[0]["value"] = this.currentYear;
    for (var i = 1; i < 5; i++) {
      this.YearRange.push({ value: this.YearRange[0]["value"] - i });
    }
    this.GetTasks();
    this.empTasksService.GetStatuses().subscribe((x) => {
      this.statuses = x;
    });
  }
  GetTasks() {
    this.Tasks = [];
    this.loading = true;
    this.empTasksService.GetEmpTasks().subscribe((x) => {
      this.Tasks = x;
      this.loading = false;
      this.BuildCommonTasks(x);
    });
  }
  BuildCommonTasks(Tasks: ITask[]) {
    if (Tasks.length == 0) this.noDataFound = true;
    else this.noDataFound = false;
    this.commonTasks = [];
    Tasks.forEach((x) => {
      if (!this.commonTasks.includes(x.name)) this.commonTasks.push(x.name);
    });
  }
  FilterTasksByCompany(id: number): ITask[] {
    return this.Tasks.filter((x) => x.clientCompanyId == id);
  }

  setStatusClass(task: ITask) {
    var statusClass = {};
    statusClass[`status-${task.status}`] = true;
    return statusClass;
  }

  changeStatus(value: number, task: ITask) {
    task.status = Number(value);
    this.empTasksService.SetStatus(task).subscribe((x) => {});
  }

  headersShown() {
    this.leftHeadersShown = true;
  }

  // setFilter(value: string, fieldName: string) {
  //   var i = this.filters.findIndex((x) => x.FieldName == fieldName);
  //   if (i > -1) this.filters.splice(i, 1);

  //   if (value != null && Number(value) > 0) {
  //     var fp = new FilterParam();
  //     fp.FieldName = fieldName;
  //     fp.DataType = DataType.String;
  //     fp.FilterType = FilterType.Equal;
  //     fp.FilterValue = value;
  //     this.filters.push(fp);
  //   }
  //   this.applyFilters(this.filters);
  // }
  applyFilters(event: FilterParam) {
    var i = this.filters.findIndex((x) => x.FieldName == event.FieldName);
    if (i > -1) this.filters.splice(i, 1);

    this.filters.push(event);
    this.loading = true;

    this.empTasksService.GetEmpTasksF(this.filters).subscribe((x) => {
      this.Tasks = x;
      this.loading = false;
      this.BuildCommonTasks(x);
    });
  }
}
