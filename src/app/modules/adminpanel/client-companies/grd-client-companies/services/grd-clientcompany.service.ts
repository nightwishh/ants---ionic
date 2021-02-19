import { Injectable } from "@angular/core";
import { CommonService } from "src/app/common/common.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  GridService,
  FilterParam,
  FilterType,
  DataType,
} from "src/app/services/grid.service";
import { ClientCompany } from "src/app/modules/emptasks/models/emptasks";

@Injectable({
  providedIn: "root",
})
export class GrdClientCompanyService {
  constructor(
    private GridService: GridService,
    private commonService: CommonService
  ) {}
  pageSize: number = 10;
  page: number = 1;
  getClientCompanies() {
    //  this.GridService.applyFilter(fp);
    this.GridService.setMaximumRows(this.pageSize);
    this.GridService.changePage(this.page);
    this.GridService.webMethod =
      this.commonService.baseUrl + "EmpTasks/GrdAllClientCompanies";
    return this.GridService.GetData<ClientCompany>();
    //  var httpOptions = this.commonService.getHttpOptions();
    // return this.http.get<Users[]>(this.commonService.baseUrl + "Users/GrdAllUsers",httpOptions);
  }
}
export interface Users {
  ID: number;
  fullName: string;
  email: string;
  bxEmail: string;
  phone: number;
  has_bx: boolean;
}
