export class Questionnaire {
   public tin:string;
   public businessTypeID:string;
   public businessDescription:string;
   public cashRegistersCount:number;
   public transactionsCount:number;
   public vatTypeID:string;
   public empCount:number;
   public fullName:string;
   public phone:string;
   public email:string;
   public package:string;
}
export class Questionnaires {
   public question:string = "";
   public answer:string = "";
   public answersList:IAnswers[] = [];
   public title:string = "";
}
export interface IAnswers {
   label:string,
   value:any
}