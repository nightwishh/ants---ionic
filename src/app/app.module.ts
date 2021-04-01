import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Inject, Injector } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./modules/header/header.component";
import { FormsModule, FormBuilder } from "@angular/forms";
import { PopupComponent } from "./components/popup/popup.component";
import {
  PopupContentComponent,
  PopupHeaderComponent,
} from "./components/popup/popup.component";
import { ClickStopPropagationDirective } from "./directives/click-stop-propagation.directive";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "./components/card/card.component";
import { SearchbarComponent } from "./components/searchbar/searchbar.component";
import { LoginComponent } from "./modules/login/login.component";
import { InputComponent } from "./components/input/input.component";
import { HomeComponent } from "./modules/home/home.component";
import { HttpClientModule } from "@angular/common/http";
import { Authuser } from "./common/authuser";
import { setAppInjector } from "./common/appinjector";
import { ChatComponent } from "./modules/chat/chat.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { ModalComponent } from "./components/modal/modal.component";
import { TasksComponent } from "./modules/tasks/tasks.component";
import { WorkgroupsComponent } from "./modules/workgroups/workgroups.component";
import { ReversePipe } from "./pipes/reverse.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from "@angular/material/paginator";
import { CustomMatPaginatorIntl } from "./common/custom-mat-paginator-intl";
import { MatInputModule } from "@angular/material/input";
import { DriveComponent } from "./modules/drive/drive.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatMenuModule } from "@angular/material/menu";
import { PLabelComponent } from "./components/p-label/p-label.component";
import { MatSortModule } from "@angular/material/sort";
import { AdminpanelComponent } from "./modules/adminpanel/adminpanel.component";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ProfileComponent } from "./modules/profile/profile.component";
import { TexteditComponent } from "./components/textedit/textedit.component";
import { UnderconstructionComponent } from "./modules/underconstruction/underconstruction.component";
import { OrgDetailsComponent } from "./modules/org-details/org-details.component";
import { PricingComponent } from "./modules/pricing/pricing.component";
import { AuthBitrixComponent } from "./modules/auth-bitrix/auth-bitrix.component";
import { GrdUsersComponent } from "./modules/adminpanel/grd-users/grd-users.component";
import {
  GridComponent,
  ColumnComponent,
} from "./components/grid/grid.component";
import { TestGridComponent } from "./modules/test-grid/test-grid.component";
import { GetfileComponent } from "./modules/getfile/getfile.component";
import { ReportsComponent } from "./modules/reports/reports.component";
import { MlPipe } from "./pipes/ml.pipe";
import { EmptasksComponent } from "./modules/emptasks/emptasks.component";
import { FilterComponent } from "./components/filter/filter.component";
import { ClientCompaniesComponent } from './modules/adminpanel/client-companies/client-companies.component';
import { CompanyDetailsComponent } from './modules/adminpanel/client-companies/company-details/company-details.component';
import { CommonTasksComponent } from './modules/adminpanel/common-tasks/common-tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PopupComponent,
    PopupContentComponent,
    PopupHeaderComponent,
    ClickStopPropagationDirective,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    SearchbarComponent,
    LoginComponent,
    InputComponent,
    HomeComponent,
    ChatComponent,
    LoaderComponent,
    ModalComponent,
    TasksComponent,
    WorkgroupsComponent,
    ReversePipe,
    DriveComponent,
    PLabelComponent,
    AdminpanelComponent,
    ProfileComponent,
    TexteditComponent,
    UnderconstructionComponent,
    OrgDetailsComponent,
    PricingComponent,
    AuthBitrixComponent,
    GrdUsersComponent,
    TestGridComponent,
    GridComponent,
    ColumnComponent,
    GetfileComponent,
    ReportsComponent,
    MlPipe,
    EmptasksComponent,
    FilterComponent,
    ClientCompaniesComponent,
    CompanyDetailsComponent,
    CommonTasksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSortModule,
    DragDropModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    MatDatepickerModule,
    MlPipe,
  ],
  bootstrap: [AppComponent],
  exports: [MlPipe],
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
