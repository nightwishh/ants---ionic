import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
import {
  DataType,
  FilterParam,
  FilterType,
} from "src/app/services/grid.service";
import {
  ClientCompany,
  CommonTask,
  Status,
  Task,
  TaskCategory,
} from "./models/emptasks";

@Component({
  templateUrl: "./emptasks.component.html",
  styleUrls: ["./emptasks.component.css"],
})
export class EmptasksComponent implements OnInit {
  constructor(private empTasksService: EmpTasksService) {}
  statuses: Status[];
  tasks$: Observable<Task[]> = this.empTasksService.GetEmpTasks();
  Tasks: Task[] = [];
  vx: number = 0;
  clientCompanies$: Observable<
    ClientCompany[]
  > = this.empTasksService.GetClientCompanies();
  categories$: Observable<
    TaskCategory[]
  > = this.empTasksService.GetCategories();

  YearRange: [{}] = [{}];
  filters: Array<FilterParam> = [];
  selectedCategory: number = 0;
  ngOnInit(): void {
    this.YearRange[0]["value"] = new Date().getFullYear();
    for (var i = 1; i < 5; i++) {
      this.YearRange.push({ value: this.YearRange[0]["value"] - i });
    }
    this.GetTasks();
    this.empTasksService.GetStatuses().subscribe((x) => {
      this.statuses = x;
    });
  }
  GetTasks() {
    this.empTasksService.GetEmpTasks().subscribe((x) => {
      this.Tasks = x;
    });
  }
  FilterTasksByCompany(id: number): Task[] {
    return this.Tasks.filter((x) => x.clientCompanyId == id);
  }

  setStatusClass(task: Task) {
    var statusClass = {};
    statusClass[`status-${task.status}`] = true;
    return statusClass;
  }

  changeStatus(value: number, task: Task) {
    task.status = Number(value);
    this.empTasksService.SetStatus(task).subscribe((x) => {});
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
    this.empTasksService.GetEmpTasksF(this.filters).subscribe((x) => {
      this.Tasks = x;
    });
  }
}
