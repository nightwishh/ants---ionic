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
declare let fbq: Function;

@Component({
  selector: "app-org-details-tax",
  templateUrl: "./org-details-tax.component.html",
  styleUrls: ["./org-details-tax.component.css"],
})
export class OrgDetailsTaxComponent implements OnInit {
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
    this.packagesAll = ["startup", "basic", "premium"];
    this.addQuestion(this.pipe.transform("აირჩიეთ პაკეტი"), [
      {
        label: this.pipe.transform("სტარტაპ პაკეტი"),
        value: "startup",
      },
      {
        label: this.pipe.transform("საბაზისო პაკეტი"),
        value: "basic",
      },
      {
        label: this.pipe.transform("პრემიუმ პაკეტი"),
        value: "premium",
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

    this.addQuestion(this.pipe.transform("ძირითადი საქმიანობის აღწერა"));
    this.addQuestion(this.pipe.transform("დამატებითი საქმიანობის აღწერა"));

    this.addQuestion(this.pipe.transform("კომპანიის საიდენტიფიკაციო კოდი"));
    this.addQuestion(this.pipe.transform("საკონტაქტო მეილი"), [], null, true);
    this.addQuestion(
      this.pipe.transform("საკონტაქტო მობილურის ნომერი"),
      [],
      null,
      true
    );
    this.addQuestion(this.pipe.transform("სახელი, გვარი"));
    this.addQuestion(this.pipe.transform("საიდან გაიგეთ ჩვენს შესახებ?"), [
      { label: "Facebook", value: "Facebook" },
      { label: "Google", value: "Google" },
      { label: "LinkedIn", value: "LinkedIn" },
      { label: "Youtube", value: "Youtube" },
      {
        label: this.pipe.transform("ბილბორდი"),
        value: this.pipe.transform("ბილბორდი"),
      },
      {
        label: this.pipe.transform("კინოთეატრის რეკლამა"),
        value: this.pipe.transform("კინოთეატრის რეკლამა"),
      },
      {
        label: this.pipe.transform("ახლობელმა მირჩია"),
        value: "ახლობელმა მირჩია",
      },
      { label: this.pipe.transform("სხვა"), value: "სხვა" },
    ]);
    this.addQuestion(this.pipe.transform("დამატებითი ინფორმაცია"));

    this.sent = false;
    // if (this.commonService.getCookie("questionnaire") == "1") {
    //   this.sent = true;
    // }
  }

  addQuestion(
    question: string,
    answersList: IAnswers[] = [],
    title: string = "",
    required: boolean = false
  ) {
    var q = new Questionnaires();
    q.question = question;
    q.title = title;
    q.required = required;
    if (answersList.length > 0) q.answersList = answersList;
    this.list.push(q);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
  saveOrgDetails() {
    var invalidFields = this.list.filter(
      (x) => x.required == true && x.answer.length == 0
    );
    if (invalidFields.length > 0) {
      alert("შეავსეთ სავალდებულო კითხვა: " + invalidFields[0].question);
      return;
    }
    // fbq("track", "Lead");
    this.commonService.post(
      "Questionnaire/SaveQuestionnaireNew",
      this.list,
      () => {
        alert("ოპერაცია წარმატებით დასრულდა.");
        this.sent = true;
        // this.commonService.setCookie("questionnaire", "1");
        setTimeout(() => {
          location.href = "https://ants.ge";
        }, 3000);
      }
    );
  }
}
