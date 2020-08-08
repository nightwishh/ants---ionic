import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridService, FilterParam, FilterType, DataType } from 'src/app/services/grid.service';

@Injectable({
  providedIn: 'root'
})
export class GrdUsersService {

  constructor(private GridService:GridService, private commonService:CommonService) {

  }
   pageSize:number = 10;
   page:number = 1;
   getUsers() {
     var fp = new FilterParam();
     fp.FieldName = "ID";
     fp.FilterValue = "2";
     fp.FilterType = FilterType.Equal;
     fp.DataType = DataType.Number;
    //  this.GridService.applyFilter(fp);
     this.GridService.setMaximumRows(this.pageSize);
     this.GridService.changePage(this.page);
     this.GridService.webMethod = this.commonService.baseUrl + "Users/GrdAllUsers";
     return this.GridService.GetData<Users>();
    //  var httpOptions = this.commonService.getHttpOptions();
    // return this.http.get<Users[]>(this.commonService.baseUrl + "Users/GrdAllUsers",httpOptions);
   }
}
export interface Users {
  id:number;
  fullName:string;
  email:string;
  bx_email:string;
  bx_password:string;
  phone:number;
}