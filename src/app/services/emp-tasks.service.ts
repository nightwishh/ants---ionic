import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../common/common.service";
import {
  ClientCompany,
  IClientCompany,
  ICommonTask,
  IStatus,
  ITask,
  ITaskCategory,
  IUserRole,
  RoleInCompany,
} from "../modules/emptasks/models/emptasks";
import { FilterParam } from "./grid.service";

import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmpTasksService {
  private httpOptions = this.commonService.getHttpOptions();
  private url = this.commonService.baseUrl;
  constructor(private http: HttpClient, private commonService: CommonService) {}
  GetCommonTasks() {
    return this.http.get<ICommonTask[]>(
      this.url + "EmpTasks/GetCommonTasks",
      this.httpOptions
    );
  }
  GetEmpTasks() {
    return this.http.get<ITask[]>(
      this.url + "EmpTasks/GetEmpTasks",
      this.httpOptions
    );
  }
  GetEmpTasksF(filters: Array<FilterParam>) {
    return this.http.post<ITask[]>(
      this.url + "EmpTasks/GetEmpTasks",
      filters,
      this.httpOptions
    );
  }
  GetClientCompanies() {
    return this.http.get<IClientCompany[]>(
      this.url + "EmpTasks/GetMyCompanies",
      this.httpOptions
    );
  }
  GetStatuses() {
    return this.http.get<IStatus[]>(
      this.url + "EmpTasks/GetStatuses",
      this.httpOptions
    );
  }
  GetUserRoles() {
    return this.http.get<IUserRole[]>(
      this.url + "EmpTasks/GetUserRoles",
      this.httpOptions
    );
  }
  GetCategories() {
    return this.http.get<ITaskCategory[]>(
      this.url + "EmpTasks/GetTaskCategories",
      this.httpOptions
    );
  }
  SetStatus(task: ITask) {
    return this.http.put(
      this.url + "EmpTasks/SetStatus",
      task,
      this.httpOptions
    );
  }
  AddCompany(company: ClientCompany) {
    return this.http
      .post(this.url + "EmpTasks/AddCompany", company, this.httpOptions)
      .pipe(catchError(this.commonService.handleErrors));
  }
  AddUserToCompany(userAndCompany: RoleInCompany) {
    return this.http.post(
      this.url + "EmpTasks/AddUserToCompany",
      userAndCompany,
      this.httpOptions
    );
  }
  DeleteUserFromCompany(userId: number, companyId: number) {
    return this.http.delete(
      this.url +
        "EmpTasks/DeleteUserFromCompany?userId=" +
        userId +
        "&Id=" +
        companyId,
      this.httpOptions
    );
  }
  DeleteCompany(companyId: number) {
    return this.http.delete(
      this.url + "EmpTasks/DeleteCompany?Id=" + +companyId,
      this.httpOptions
    );
  }
}
