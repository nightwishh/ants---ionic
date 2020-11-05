import { Component, OnInit, ElementRef } from '@angular/core';
import { IAnswers, Questionnaire, Questionnaires } from './models/org-details.model';
import { CommonService } from 'src/app/common/common.service';
import { write, accessSync } from 'fs';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { strict } from 'assert';
import { Authuser } from 'src/app/common/authuser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-org-details',
  templateUrl: './org-details.component.html',
  styleUrls: ['./org-details.component.css']
})
export class OrgDetailsComponent implements OnInit {
  packagesAll = ["სტარტაპერი","მცირე ბიზნესი","ინდივიდუალური"];

  constructor(private elementRef: ElementRef, private commonService:CommonService, private route:ActivatedRoute) { 
    this.addQuestion("აირჩიეთ პაკეტი",[{
      label:"სტარტაპერი", value:"სტარტაპერი"
    },
    {
      label:"მცირე ბიზნესი", value:"მცირე ბიზნესი"
    },
    {
      label:"ინდივიდუალური", value:"ინდივიდუალური"
    }
  ]);

    route.params.subscribe(x=> {
      if (x["id"]) {
        if (this.packagesAll.indexOf(x["id"])>-1)
        this.list[0].answer = x["id"];
      }
    })
  }
  org:Questionnaire = new Questionnaire();
  list:Array<Questionnaires> = [];

  public sent:boolean = false;
  userLoggedIn = Authuser.userLoggedIn();
  ngOnInit(): void {
    var pkgs:IAnswers[] = [];
    var i = -1;
    this.packagesAll.forEach(x=> {
      i++;
      pkgs.push({label:x, value:x});
    })
    
    this.addQuestion("ძირითადი საქმიანობა");
    this.addQuestion("დამატებითი საქმიანობა");
    this.addQuestion("სალარო აპარატების რაოდენობა");
    this.addQuestion("ნაღდი ფულის ოპერაციების რაოდენობა (თვეში)");
    this.addQuestion("იმპორტების რაოდენობა (თვეში)");
    this.addQuestion("თანამშრომლების რაოდენობა");
    this.addQuestion("შესყიდვის ინვოისების რაოდენობა (თვეში)");
    this.addQuestion("ხართ თუ არა დღგ-ს გადამხდელად რეგისტრირებული?");
    this.addQuestion("რამდენი სახეობის კომერციული მარაგი გაქვთ?");
    this.addQuestion("გაქვს თუ არა წარმოება, კომპლექტაცია?");
    this.addQuestion("საწყობების რაოდენობა");
    this.addQuestion("იყენებთ თუ არა საწვავს საქმიანობაში?");
  
    this.addQuestion("კომპანიის საიდენტიფიკაციო კოდი");
    this.addQuestion("საკონტაქტო მეილი");
    this.addQuestion("საკონტაქტო მობილურის ნომერი");
    this.addQuestion("სახელი, გვარი");

    this.addQuestion("საბანკო გადარიცხვებს თქვენ გააკეთებთ თუ ჩვენი დახმარება გჭირდებათ?",[],"საოპერაციო საქმიანობა (დამატებითი პაკეტი)");
    this.addQuestion("გჭირდებათ თუ არა დახმარება, ინვოისების, ზედნადებების, მიღება-ჩაბარებების და სხვა პირველადი დოკუმენტების შექმნაში?");
    this.addQuestion("საშუალო ყოველთვიური შემოსავალი დღგ-ს გარეშე");

    this.sent = false;
    if (this.commonService.getCookie("questionnaire") == "1") {
      this.sent = true;
    }
  }

  addQuestion(question:string, answersList:IAnswers[] = [], title:string = "") {
    var q = new Questionnaires();
    q.question = question;
    q.title = title;
    if (answersList.length > 0)
    q.answersList = answersList;
    this.list.push(q);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
  saveOrgDetails() {  
    this.commonService.post("Questionnaire/SaveQuestionnaireNew",this.list, () => {
      alert("ოპერაცია წარმატებით დასრულდა.");
      this.sent = true;
      this.commonService.setCookie("questionnaire","1");
      setTimeout(() => {
        location.href = "/";
      }, 3000);
    });
  }
}
