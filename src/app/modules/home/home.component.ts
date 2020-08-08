import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private commonService:CommonService, private http:HttpClient) { }

  ngOnInit(): void {
  }
 AntsToken() {
  //  this.http.get("https://b24-qbgwgy.bitrix24.com/oauth/authorize/?response_type=code&client_id=local.5ea9bc452e9315.41924113&redirect_uri=app_URL",null);
  // this.commonService.post("",null);
  this.commonService.getBX("https://b24-qbgwgy.bitrix24.com/rest/tasks.task.list?auth=" + this.commonService.getCookie("bxat"));
 }
 ClientToken() {

 }
}
