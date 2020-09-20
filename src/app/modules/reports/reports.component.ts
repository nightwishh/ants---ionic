import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientsBalances } from './models/report.model';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private commonService:CommonService) { 
    this.currentBxWorkgroup = Authuser.workgroup.active ? Authuser.workgroup.name.trim() : "";
    console.log(this.currentBxWorkgroup);
  }
  currentBxWorkgroup = "";
  ngOnInit(): void {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': 'Basic ' + btoa('demo:'),
    //     "Access-Control-Allow-Origin":"*"
    //   })
    // };    
    // this.http.get<ClientsBalances>("http://188.93.95.179:8081/demo/hs/Exchange/ClientsBalances",httpOptions).subscribe(x=> {
    //   console.log(x);
    // })
  }

}
