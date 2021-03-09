import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { GridComponent } from "src/app/components/grid/grid.component";
import {
  ClientCompany,
  RoleInCompany,
  IClientCompany,
  IUserRole,
} from "src/app/modules/emptasks/models/emptasks";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
import {
  FilterParam,
  FilterType,
  GridService,
} from "src/app/services/grid.service";
import { ClientCompaniesService } from "../services/client-companies.service";

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.css"],
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  filters: FilterParam[] = [];
  selectedCompany: ClientCompany = new ClientCompany();
  userRoles$: Observable<IUserRole[]> = this.empTaskService.GetUserRoles();
  empMember: RoleInCompany = new RoleInCompany();
  private _showGrdUsers: boolean = false;
  public get showGrdUsers(): boolean {
    return this._showGrdUsers;
  }
  public set showGrdUsers(value: boolean) {
    if (value == false) {
      this.addCompanyFilter();
    }
    this._showGrdUsers = value;
  }
  constructor(
    private route: ActivatedRoute,
    private clientCompanyService: ClientCompaniesService,
    private empTaskService: EmpTasksService
  ) {
    if (!this.clientCompanyService.selectedCompany)
      location.href = "/Admpnl-ClientCompanies";
    this.selectedCompany = this.clientCompanyService.selectedCompany;
    console.log(this.selectedCompany);
    //this.route.params.subscribe((param) => {
    //  if (param["id"] && param["id"] > 0) {
    if (this.selectedCompany.id > 0) {
      this.addCompanyFilter();
    }
    // }
    // });
  }
  addCompanyFilter() {
    var fp = new FilterParam();
    fp.FieldName = "CompanyId";
    fp.FilterValue = this.selectedCompany.id.toString();
    fp.FilterType = FilterType.Equal;
    this.filters.push(fp);
  }
  ngOnInit(): void {}

  AddNewUserToCompany(row) {
    if (!this.empMember.RoleId) {
      alert("აირჩიე როლი");
      return;
    }

    this.empMember.userId = row["ID"];
    this.empMember.userFullName = row["fullName"];
    this.empMember.Id = this.selectedCompany.id;
    this.empMember.Name = this.selectedCompany.name;
    this.empMember.RoleId = Number(this.empMember.RoleId);
    this.empTaskService.AddUserToCompany(this.empMember).subscribe((x) => {
      location.reload();
    });
  }
  deleteUserFromCompany(row) {
    if (!confirm("ნამდვილად გსურთ წაშლა ?")) return;
    this.empTaskService
      .DeleteUserFromCompany(
        row["Id"],
        this.clientCompanyService.selectedCompany.id
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.clientCompanyService.selectedCompany = new ClientCompany();
  }
}
