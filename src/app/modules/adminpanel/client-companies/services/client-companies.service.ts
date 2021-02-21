import { Injectable } from "@angular/core";
import { ClientCompany } from "src/app/modules/emptasks/models/emptasks";

@Injectable({
  providedIn: "root",
})
export class ClientCompaniesService {
  selectedCompany: ClientCompany;
  constructor() {}
}
