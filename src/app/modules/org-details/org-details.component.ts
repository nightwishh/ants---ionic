import { Component, OnInit, ElementRef } from '@angular/core';
import { Questionnaire } from './models/org-details.model';
import { CommonService } from 'src/app/common/common.service';
import { write, accessSync } from 'fs';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { strict } from 'assert';

@Component({
  selector: 'app-org-details',
  templateUrl: './org-details.component.html',
  styleUrls: ['./org-details.component.css']
})
export class OrgDetailsComponent implements OnInit {

  constructor(private elementRef: ElementRef, private commonService:CommonService) { }
  org:Questionnaire = new Questionnaire();
  public sent:boolean = false;
  ngOnInit(): void {
    this.sent = false;
    if (this.commonService.getCookie("questionnaire") == "1") {
      this.sent = true;
    }
    // var bxheaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
    // bxheaders.append("Access-Control-Allow-Origin",location.href);
    // var httpOptions = { headers: bxheaders}
    // this.http.get("http://188.93.95.179:8081/Balance_Exchange/hs/Exchange/ClientsBalances",httpOptions).subscribe((data) => {
    // console.log(data);
    // })
    // var param = new Object();
    // param["newField"] = "hello world from angular OrgDetails Page";
    // var str:string = "Hello";
    // this.commonService.getBX("event.test",param);
    // this.commonService.get("Users/RaiseError");
  }
  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
  saveOrgDetails() {
    this.commonService.post("Questionnaire/SaveQuestionnaire",this.org, () => {
      alert("ოპერაცია წარმატებით დასრულდა.");
      this.sent = true;
      this.commonService.setCookie("questionnaire","1");
      setTimeout(() => {
        location.href = "/";
      }, 3000);
    });
  }
}
