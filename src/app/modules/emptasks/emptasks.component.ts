import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Observable } from "rxjs";
import { Authuser } from "src/app/common/authuser";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
import {
  DataType,
  FilterParam,
  FilterType,
} from "src/app/services/grid.service";
import {
  CommonTask,
  IClientCompany,
  ICommonTask,
  IStatus,
  ITask,
  ITaskCategory,
  IUserRole,
  UserRoleWithCategories,
  vEmployeeTeam,
} from "./models/emptasks";

@Component({
  templateUrl: "./emptasks.component.html",
  styleUrls: ["./emptasks.component.css"],
})
export class EmptasksComponent implements OnInit, AfterViewInit {
  constructor(
    private empTasksService: EmpTasksService,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
  ) {}
  statuses: IStatus[];
  managers$: Observable<vEmployeeTeam[]> = this.empTasksService.GetManagers();
  tasks$: Observable<ITask[]> = this.empTasksService.GetEmpTasks();
  userRoles$: Observable<UserRoleWithCategories[]> =
    this.empTasksService.GetUserRolesWithCategories();
  Tasks: ITask[] = [];
  vx: number = 0;
  clientCompanies$: Observable<IClientCompany[]> =
    this.empTasksService.GetClientCompanies();
  clientCompanies: IClientCompany[];

  categories$: Observable<ITaskCategory[]> =
    this.empTasksService.GetCategories();
  commonTasks: CommonTask[] = [];

  YearRange: [{}] = [{}];
  filters: Array<FilterParam> = [];
  selectedCategory: number = 0;
  leftHeadersShown: boolean = false;
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  noDataFound: boolean = false;
  loading: boolean = true;
  showFixedHeaders: boolean = false;

  activeFilter: number = 0;
  managerFilterId: number = 0;
  ngOnInit(): void {
    this.checkAdmin();

    this.YearRange[0]["value"] = this.currentYear;
    for (var i = 1; i < 5; i++) {
      this.YearRange.push({ value: this.YearRange[0]["value"] - i });
    }
    this.GetTasks();
    this.empTasksService.GetStatuses().subscribe((x) => {
      this.statuses = x;
    });
    this.empTasksService.GetManagers().subscribe((x) => {
      console.log(x);
    });
    console.log("Admin: " + this.isAdmin);
    this.zone.runOutsideAngular(() => {
      // var msgsView = this.messagesView.nativeElement as HTMLElement;
      var tasksScrollView = null;
      document.addEventListener("scroll", (e) => {
        if (document.documentElement.scrollTop >= 132) {
          if (!this.showFixedHeaders) {
            this.showFixedHeaders = true;
            this.cdRef.detectChanges();
            adjust(
              this.tasksScrollView.nativeElement as HTMLElement,
              this.companyHeadersPh.nativeElement as HTMLElement
            );
          }
        } else if (this.showFixedHeaders) {
          this.showFixedHeaders = false;
          this.cdRef.detectChanges();
        }
        if (tasksScrollView == null) {
          tasksScrollView = this.tasksScrollView.nativeElement as HTMLElement;
          if (tasksScrollView == null || typeof tasksScrollView == "undefined")
            return;

          tasksScrollView.addEventListener("scroll", (e) => {
            if (this.showFixedHeaders && this.companyHeadersPh != null) {
              adjust(
                tasksScrollView,
                this.companyHeadersPh.nativeElement as HTMLElement
              );
            }
          });
        }
      });
      function adjust(
        tasksScrollView: HTMLElement,
        companyHeadersView: HTMLElement
      ) {
        try {
          var tscroll = tasksScrollView;
          var c = companyHeadersView;

          var tscrollW = tscroll.scrollWidth;
          var tscrollL = tscroll.scrollLeft;
          var tPerc = tscrollL / tscrollW;

          // var cscrollW = ;
          // var cscrollL = c.scrollLeft;
          // var cscrollPerc = cscrollL / cscrollW;

          c.scroll(c.scrollWidth * tPerc, 0);
        } catch {}
      }
    });
  }

  @ViewChild("companyHeadersScroll", { static: false })
  private companyHeadersPh: ElementRef;
  @ViewChild("tasksScrollView", { static: false }) tasksScrollView: ElementRef;

  ngAfterViewInit() {
    // console.log(this.companyHeadersPh.nativeElement);
    // setTimeout(() => {
    // }, 500);
  }

  isAdmin: boolean = false;
  checkAdmin() {
    Authuser.getUserData((data) => {
      this.isAdmin = data.isAdmin;
    }, true);
  }
  GetTasks() {
    this.Tasks = [];
    this.loading = true;
    this.empTasksService.GetEmpTasks().subscribe((x) => {
      this.Tasks = x;
      this.loading = false;
      this.BuildCommonTasks(x);
    });
  }
  BuildCommonTasks(Tasks: ITask[]) {
    if (Tasks.length == 0) this.noDataFound = true;
    else this.noDataFound = false;
    this.commonTasks = [];
    Tasks.forEach((x) => {
      if (this.commonTasks.findIndex((a) => a.name == x.name) == -1) {
        var n = new CommonTask();
        n.name = x.name;
        n.deadlineDay = x.deadlineDay;
        this.commonTasks.push(n);
      }
    });
  }
  FilterTasksByCompany(id: number): ITask[] {
    return this.Tasks.filter((x) => x.clientCompanyId == id);
  }

  setStatusClass(task: ITask) {
    var statusClass = {};
    statusClass[`status-${task.status}`] = true;
    return statusClass;
  }

  changeStatus(value: number, task: ITask) {
    task.status = Number(value);
    this.empTasksService.SetStatus(task).subscribe((x) => {});
  }

  headersShown() {
    this.leftHeadersShown = true;
  }
  aaa() {
    console.log(document.body.scrollTop);
  }
  // setFilter(value: string, fieldName: string) {
  //   var i = this.filters.findIndex((x) => x.FieldName == fieldName);
  //   if (i > -1) this.filters.splice(i, 1);

  //   if (value != null && Number(value) > 0) {
  //     var fp = new FilterParam();
  //     fp.FieldName = fieldName;
  //     fp.DataType = DataType.String;
  //     fp.FilterType = FilterType.Equal;
  //     fp.FilterValue = value;
  //     this.filters.push(fp);
  //   }
  //   this.applyFilters(this.filters);
  // }

  managerFilter(event: FilterParam) {
    this.managerFilterId = Number(event.FilterValue);
    this.applyFilters(event);
  }
  applyFilters(event: FilterParam) {
    var i = this.filters.findIndex((x) => x.FieldName == event.FieldName);
    if (i > -1) this.filters.splice(i, 1);

    this.filters.push(event);
    this.loading = true;

    this.empTasksService.GetEmpTasksF(this.filters).subscribe((x) => {
      this.Tasks = x;
      this.loading = false;
      this.clientCompanies$ = this.empTasksService.GetClientCompanies(
        this.managerFilterId
      );

      this.BuildCommonTasks(x);
    });
  }
  showCompanyDetails: boolean = false;
  companyDetails: vEmployeeTeam[] = [];
  GetCompanyDetails(id: number) {
    this.showCompanyDetails = true;
    this.empTasksService.GetCompanyDetails(id).subscribe((x) => {
      this.companyDetails = x;
      console.log(x);
    });
  }
}
