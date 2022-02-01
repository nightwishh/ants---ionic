import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HeaderComponent } from "./modules/header/header.component";
import { LoginComponent } from "./modules/login/login.component";
import { HomeComponent } from "./modules/home/home.component";
import { Authuser } from "./common/authuser";
import { ChatComponent } from "./modules/chat/chat.component";
import { TasksComponent } from "./modules/tasks/tasks.component";
import { WorkgroupsComponent } from "./modules/workgroups/workgroups.component";
import { DriveComponent } from "./modules/drive/drive.component";
import { AdminpanelComponent } from "./modules/adminpanel/adminpanel.component";
import { ProfileComponent } from "./modules/profile/profile.component";
import { UnderconstructionComponent } from "./modules/underconstruction/underconstruction.component";
import { OrgDetailsComponent } from "./modules/org-details/org-details.component";
import { PricingComponent } from "./modules/pricing/pricing.component";
import { AuthBitrixComponent } from "./modules/auth-bitrix/auth-bitrix.component";
import { TestGridComponent } from "./modules/test-grid/test-grid.component";
import { GetfileComponent } from "./modules/getfile/getfile.component";
import { ReportsComponent } from "./modules/reports/reports.component";
import { EmptasksComponent } from "./modules/emptasks/emptasks.component";
import { ClientCompaniesComponent } from "./modules/adminpanel/client-companies/client-companies.component";
import { CompanyDetailsComponent } from "./modules/adminpanel/client-companies/company-details/company-details.component";
import { CommonTasksComponent } from "./modules/adminpanel/common-tasks/common-tasks.component";
import { XWaybillComponent } from "./modules/x-waybill/x-waybill.component";

const routes: Routes = [
  { path: "", component: TasksComponent },
  { path: "", component: LoginComponent, outlet: "NotLoggedIn" },
  {
    path: "Registration/:id",
    component: LoginComponent,
    outlet: "NotLoggedIn",
  },
  { path: "Home", component: TasksComponent },
  { path: "Home/:id", component: TasksComponent },
  { path: "Chat", component: ChatComponent },
  { path: "Chat/:id", component: ChatComponent },
  { path: "EmpTasks", component: EmptasksComponent },
  { path: "Tasks", component: TasksComponent },
  { path: "Tasks/:id", component: TasksComponent },
  //{path:"TestGrid", component:TestGridServiceComponent},
  // {path:"Workgroups", component:WorkgroupsComponent},
  { path: "Drive", component: DriveComponent },
  { path: "Drive/:id", component: DriveComponent },
  { path: "Profile", component: ProfileComponent },
  { path: "Profile/:tab", component: ProfileComponent },
  { path: "Sales", component: UnderconstructionComponent },
  { path: "Reports", component: UnderconstructionComponent },
  { path: "ReportsTesting123", component: ReportsComponent },
  { path: "OrgDetails", component: OrgDetailsComponent },
  { path: "O", component: OrgDetailsComponent, outlet: "Q" },
  {
    path: "O/:id",
    component: OrgDetailsComponent,
    outlet: "Q",
  },
  {
    path: "O/:id/:lang",
    component: OrgDetailsComponent,
    outlet: "Q",
  },
  // {path:"Pricing", component:PricingComponent},
  { path: "AuthBitrix", component: AuthBitrixComponent },
  { path: "Admpnl", component: AdminpanelComponent },
  { path: "Admpnl/:tabActive", component: AdminpanelComponent },
  {
    path: "Admpnl-ClientCompanies",
    component: ClientCompaniesComponent,
  },
  {
    path: "Admpnl-ClientCompanies/:id",
    component: CompanyDetailsComponent,
  },
  {
    path: "Admpnl-CommonTasks",
    component: CommonTasksComponent,
  },
  { path: "GetFile/:id", component: GetfileComponent },
  // {path:"TestGrid", component:TestGridComponent},
  {
    path: "xWaybill",
    component: XWaybillComponent,
  },
  { path: "**", redirectTo: "" },
  // {path:"Login", component:LoginComponent},
  // {path:"Header", component:HeaderComponent, canActivate:[Authuser]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
