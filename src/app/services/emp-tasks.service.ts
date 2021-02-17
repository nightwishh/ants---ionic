import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { ClientCompany, CommonTask, Task } from '../modules/emptasks/models/emptasks';

@Injectable({
  providedIn: 'root'
})
export class EmpTasksService {
  private httpOptions = this.commonService.getHttpOptions();
  private url = this.commonService.baseUrl;
  constructor(private http:HttpClient, private commonService:CommonService) { 

   }
   GetCommonTasks() {
     return this.http.get<CommonTask[]>(this.url + "EmpTasks/GetCommonTasks",this.httpOptions);
   }
   GetEmpTasks() {
    return this.http.get<Task[]>(this.url + "EmpTasks/GetEmpTasks",this.httpOptions);
   }
   GetClientCompanies() {
    return this.http.get<ClientCompany[]>(this.url + "EmpTasks/GetClientCompanies",this.httpOptions);
   }
}
