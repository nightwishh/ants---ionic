import { Pipe, PipeTransform } from "@angular/core";
import { CommonService } from "../common/common.service";

@Pipe({
  name: "ml",
})
export class MlPipe implements PipeTransform {
  lang: string = "GEO";
  constructor(private commonService: CommonService) {}
  transform(value: string, ...args: string[]): string {
    if (this.commonService.getCookie("lang") == "ENG")
      return langDictionary.dictionary[value];
    else return value;
  }
}

export class langDictionary {
  public static dictionary: Object = {
    "ბუღალტრული მომსახურების შეთავაზების მისაღებად შეავსეთ კითხვარი":
      "To send you a service offer, please fill in the questionnaire",
    სტარტაპერი: "Startup",
    "მცირე ბიზნესი": "Small business",
    ინდივიდუალური: "Individual",
    "აირჩიეთ პაკეტი": "Select service package",
    "ძირითადი საქმიანობა": "Key business area",
    "დამატებითი საქმიანობა": "Supplementary business area",
    "სალარო აპარატების რაოდენობა": "Number of cash machines in the business",
    "ნაღდი ფულის ოპერაციების რაოდენობა (თვეში)":
      "Number of cash operations (monthly)",
    "იმპორტების რაოდენობა (თვეში)": "Number of imports (monthly)",
    "თანამშრომლების რაოდენობა": "Number of employees",
    "შესყიდვის ინვოისების რაოდენობა (თვეში)":
      "Number of purchase invoices (monthly)",
    "ხართ თუ არა დღგ-ს გადამხდელად რეგისტრირებული?":
      "Is your business registered as a VAT payer?",
    "რამდენი სახეობის კომერციული მარაგი გაქვთ?":
      "How many types of inventories does your business have?",
    "გაქვს თუ არა წარმოება, კომპლექტაცია?":
      "Does your business have manufacturing?",
    "საწყობების რაოდენობა": "Number of warehouses",
    "იყენებთ თუ არა საწვავს საქმიანობაში?":
      "Does your business use fuel in everyday operations?",
    "კომპანიის საიდენტიფიკაციო კოდი": "Company’s identification number",
    "საკონტაქტო მეილი": "Contact e-mail",
    "საკონტაქტო მობილურის ნომერი": "Mobile phone number",
    "სახელი, გვარი": "Name and Surname",
    "საოპერაციო საქმიანობა (დამატებითი პაკეტი)":
      "Operations (supplementary service package)",
    "საბანკო გადარიცხვებს თქვენ გააკეთებთ თუ ჩვენი დახმარება გჭირდებათ?":
      "Do you plan to perform bank transfers on your own or would you like us to assist you?",
    "გჭირდებათ თუ არა დახმარება, ინვოისების, ზედნადებების, მიღება-ჩაბარებების და სხვა პირველადი დოკუმენტების შექმნაში?":
      "Do you need our assistance in preparing invoices, act-of acceptances and other documents?",
    "საშუალო ყოველთვიური შემოსავალი დღგ-ს გარეშე":
      "What is your business’ average monthly revenue excluding VAT?",
    "კითხვარი წარმატებით გადაიგზავნა და შეთავაზებას გამოგიგზავნით უახლოეს მომავალში":
      "Questionnaire has sent successfully. wait for our offer soon",
    გაგზავნა: "Send",
  };
}
