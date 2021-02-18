import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../common/common.service";
import {
  ClientCompany,
  CommonTask,
  Status,
  Task,
  TaskCategory,
} from "../modules/emptasks/models/emptasks";
import { FilterParam } from "./grid.service";

@Injectable({
  providedIn: "root",
})
export class EmpTasksService {
  private httpOptions = this.commonService.getHttpOptions();
  private url = this.commonService.baseUrl;
  constructor(private http: HttpClient, private commonService: CommonService) {}
  GetCommonTasks() {
    return this.http.get<CommonTask[]>(
      this.url + "EmpTasks/GetCommonTasks",
      this.httpOptions
    );
  }
  GetEmpTasks() {
    return this.http.get<Task[]>(
      this.url + "EmpTasks/GetEmpTasks",
      this.httpOptions
    );
  }
  GetEmpTasksF(filters: Array<FilterParam>) {
    return this.http.post<Task[]>(
      this.url + "EmpTasks/GetEmpTasks",
      filters,
      this.httpOptions
    );
  }
  GetClientCompanies() {
    return this.http.get<ClientCompany[]>(
      this.url + "EmpTasks/GetClientCompanies",
      this.httpOptions
    );
  }
  GetStatuses() {
    return this.http.get<Status[]>(
      this.url + "EmpTasks/GetStatuses",
      this.httpOptions
    );
  }
  GetCategories() {
    return this.http.get<TaskCategory[]>(
      this.url + "EmpTasks/GetTaskCategories",
      this.httpOptions
    );
  }
  SetStatus(task: Task) {
    return this.http.put(
      this.url + "EmpTasks/SetStatus",
      task,
      this.httpOptions
    );
  }
}
