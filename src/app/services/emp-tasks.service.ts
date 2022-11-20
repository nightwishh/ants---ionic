import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../common/common.service";
import {
  ClientCompany,
  CommonTask,
  IClientCompany,
  ICommonTask,
  IStatus,
  ITask,
  ITaskCategory,
  IUserRole,
  RoleInCompany,
  UserRoleWithCategories,
  vEmployeeTeam,
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
  GetClientCompanies(userId: number = null) {
    var params = "";
    if (userId != null && userId > 0) params = "?userId=" + userId;

    return this.http.get<IClientCompany[]>(
      this.url + "EmpTasks/GetMyCompanies" + params,
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
  GetUserRolesWithCategories() {
    return this.http.get<UserRoleWithCategories[]>(
      this.url + "EmpTasks/GetUserRolesWithCategories",
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
      this.url + "EmpTasks/DeleteCompany?Id=" + companyId,
      this.httpOptions
    );
  }
  DeleteTask(commonTaskSerialized: string) {
    return this.http.delete(
      this.url + "EmpTasks/DeleteTask?" + commonTaskSerialized,
      this.httpOptions
    );
  }
  AddCommonTask(commonTask: CommonTask) {
    return this.http
      .post(this.url + "EmpTasks/AddCommonTask", commonTask, this.httpOptions)
      .pipe(catchError(this.commonService.handleErrors));
  }
  GetManagers() {
    return this.http.get<vEmployeeTeam[]>(
      this.url + "EmpTasks/GetManagersByCompany",
      this.httpOptions
    );
  }
  GetAccountants() {
    return this.http.get<vEmployeeTeam[]>(
      this.url + "EmpTasks/GetAccountants",
      this.httpOptions
    );
  }
  GetAssistants() {
    return this.http.get<vEmployeeTeam[]>(
      this.url + "EmpTasks/GetAssistants",
      this.httpOptions
    );
  }
  GetCompanyDetails(companyId: number) {
    if (companyId == 0) return;
    return this.http.get<vEmployeeTeam[]>(
      this.url + "EmpTasks/GetCompanyDetails?companyId=" + companyId,
      this.httpOptions
    );
  }
  UploadCommonTasksExcel(file: File) {
    var formData: FormData = new FormData();
    formData.append("uploadFile", file, file.name);
    var options = this.httpOptions;
    var httpOptions = this.httpOptions;
    var headers: Headers = this.httpOptions["headers"] as Headers;

    var newheaders = new HttpHeaders({
      Authorization: headers.get("authorization"),
    });
    httpOptions["headers"] = newheaders;

    return this.http
      .post(this.url + "EmpTasks/UploadCommonTasksExcel", formData, httpOptions)
      .pipe(catchError(this.commonService.handleErrors));
  }
}
