import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ClientCompany, IClientCompany } from "../../emptasks/models/emptasks";
import { ClientCompaniesService } from "./services/client-companies.service";

@Component({
  selector: "app-client-companies",
  templateUrl: "./client-companies.component.html",
  styleUrls: ["./client-companies.component.css"],
})
export class ClientCompaniesComponent implements OnInit {
  constructor(
    private router: Router,
    private companyService: ClientCompaniesService
  ) {
    this.companyService.selectedCompany = new ClientCompany();
  }
  addNewCompany: boolean = false;
  onRowClick(row) {
    this.companyService.selectedCompany.id = row.Id;
    this.companyService.selectedCompany.name = row.Name;
    this.companyService.selectedCompany.tin = row.Tin;
    this.router.navigateByUrl(this.router.url + `/${row["Id"]}`);
  }
  ngOnInit(): void {}
}
