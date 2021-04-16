import { Component, OnInit, ElementRef } from "@angular/core";
import {
  IAnswers,
  Questionnaire,
  Questionnaires,
} from "./models/org-details.model";
import { CommonService } from "src/app/common/common.service";
import { write, accessSync } from "fs";
import { HttpRequest, HttpClient, HttpHeaders } from "@angular/common/http";
import { strict } from "assert";
import { Authuser } from "src/app/common/authuser";
import { ActivatedRoute } from "@angular/router";
import { MlPipe } from "src/app/pipes/ml.pipe";

@Component({
  selector: "app-org-details",
  templateUrl: "./org-details.component.html",
  styleUrls: ["./org-details.component.css"],
})
export class OrgDetailsComponent implements OnInit {
  packagesAll = [];
  lang: string = "GEO";
  constructor(
    private elementRef: ElementRef,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private pipe: MlPipe
  ) {
    route.params.subscribe((x) => {
      if (x["lang"]) {
        this.lang = x["lang"];
        if (this.lang == "ENG") this.commonService.setCookie("lang", "ENG");
        else this.commonService.setCookie("lang", "GEO");
      } else this.commonService.setCookie("lang", "GEO");
    });
    this.packagesAll = [
      this.pipe.transform("სტარტაპერი"),
      this.pipe.transform("მცირე ბიზნესი"),
      this.pipe.transform("ინდივიდუალური"),
    ];
    this.addQuestion(this.pipe.transform("აირჩიეთ პაკეტი"), [
      {
        label: this.pipe.transform("სტარტაპერი"),
        value: this.pipe.transform("სტარტაპერი"),
      },
      {
        label: this.pipe.transform("მცირე ბიზნესი"),
        value: this.pipe.transform("მცირე ბიზნესი"),
      },
      {
        label: this.pipe.transform("ინდივიდუალური"),
        value: this.pipe.transform("ინდივიდუალური"),
      },
    ]);
    route.params.subscribe((x) => {
      if (x["id"]) {
        if (this.packagesAll.indexOf(x["id"]) > -1)
          this.list[0].answer = x["id"];
      }
    });
  }
  org: Questionnaire = new Questionnaire();
  list: Array<Questionnaires> = [];

  public sent: boolean = false;
  userLoggedIn = Authuser.userLoggedIn();
  ngOnInit(): void {
    var pkgs: IAnswers[] = [];
    var i = -1;
    this.packagesAll.forEach((x: string) => {
      i++;
      pkgs.push({ label: x, value: x });
    });

    this.addQuestion(this.pipe.transform("ძირითადი საქმიანობა"));
    this.addQuestion(this.pipe.transform("დამატებითი საქმიანობა"));
    this.addQuestion(this.pipe.transform("სალარო აპარატების რაოდენობა"));
    this.addQuestion(
      this.pipe.transform("საშუალო ყოველთვიური შემოსავალი დღგ-ს გარეშე")
    );
    this.addQuestion(this.pipe.transform("ჩეკების რაოდენობა თვეში"));
    this.addQuestion(this.pipe.transform("იმპორტების რაოდენობა (თვეში)"));
    this.addQuestion(this.pipe.transform("თანამშრომლების რაოდენობა"));
    this.addQuestion(
      this.pipe.transform("შესყიდვის ინვოისების რაოდენობა (თვეში)")
    );
    this.addQuestion(
      this.pipe.transform("ხართ თუ არა დღგ-ს გადამხდელად რეგისტრირებული?")
    );
    this.addQuestion(
      this.pipe.transform("რამდენი სახეობის კომერციული მარაგი გაქვთ?")
    );
    this.addQuestion(
      this.pipe.transform("გაქვს თუ არა წარმოება, კომპლექტაცია?")
    );
    this.addQuestion(this.pipe.transform("საწყობების რაოდენობა"));
    this.addQuestion(
      this.pipe.transform("იყენებთ თუ არა საწვავს საქმიანობაში?")
    );

    this.addQuestion(this.pipe.transform("კომპანიის საიდენტიფიკაციო კოდი"));
    this.addQuestion(this.pipe.transform("საკონტაქტო მეილი"));
    this.addQuestion(this.pipe.transform("საკონტაქტო მობილურის ნომერი"));
    this.addQuestion(this.pipe.transform("სახელი, გვარი"));

    this.addQuestion(
      this.pipe.transform(
        "საბანკო გადარიცხვებს თქვენ გააკეთებთ თუ ჩვენი დახმარება გჭირდებათ?"
      ),
      [],
      this.pipe.transform("საოპერაციო საქმიანობა (დამატებითი პაკეტი)")
    );
    this.addQuestion(
      this.pipe.transform(
        "გჭირდებათ თუ არა დახმარება, ინვოისების, ზედნადებების, მიღება-ჩაბარებების და სხვა პირველადი დოკუმენტების შექმნაში?"
      )
    );

    this.sent = false;
    if (this.commonService.getCookie("questionnaire") == "1") {
      this.sent = true;
    }
  }

  addQuestion(
    question: string,
    answersList: IAnswers[] = [],
    title: string = ""
  ) {
    var q = new Questionnaires();
    q.question = question;
    q.title = title;
    if (answersList.length > 0) q.answersList = answersList;
    this.list.push(q);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
  saveOrgDetails() {
    this.commonService.post(
      "Questionnaire/SaveQuestionnaireNew",
      this.list,
      () => {
        alert("ოპერაცია წარმატებით დასრულდა.");
        this.sent = true;
        this.commonService.setCookie("questionnaire", "1");
        setTimeout(() => {
          location.href = "/";
        }, 3000);
      }
    );
  }
}
