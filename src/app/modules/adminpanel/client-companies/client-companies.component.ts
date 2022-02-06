import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
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
    private companyService: ClientCompaniesService,
    private empTasks: EmpTasksService
  ) {
    this.companyService.selectedCompany = new ClientCompany();
  }
  addNewCompany: boolean = false;
  newCompany: ClientCompany = new ClientCompany();
  loading: boolean = false;
  isDeleting: boolean = false;
  onRowClick(row) {
    if (this.isDeleting) return;
    this.companyService.selectedCompany.id = row.Id;
    this.companyService.selectedCompany.name = row.Name;
    this.companyService.selectedCompany.tin = row.Tin;
    this.router.navigateByUrl(this.router.url + `/${row["Id"]}`);
  }
  addCompany() {
    this.loading = true;
    this.addNewCompany = false;
    this.empTasks.AddCompany(this.newCompany).subscribe(
      (x) => {
        location.reload();
      },
      (err) => {
        this.loading = false;
        alert("კომპანია ვერ დაემატა.");
      }
    );
  }
  deleteCompany(row) {
    this.isDeleting = true;
    if (!confirm("ნამდვილად გსურთ წაშლა ?")) {
      setTimeout(() => {
        this.isDeleting = false;
      }, 1000);
      return;
    }
    this.loading = true;
    this.empTasks.DeleteCompany(row["Id"]).subscribe(
      (x) => {
        location.reload();
      },
      (err) => {
        this.loading = false;
        alert("კომპანია ვერ წაიშალა.");
      }
    );
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    // this.clientCompanyService.selectedCompany = new ClientCompany();
  }
}
