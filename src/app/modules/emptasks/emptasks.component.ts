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
import { Comment } from "../emptasks/models/emptasks";
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
  accountants$: Observable<vEmployeeTeam[]> =
    this.empTasksService.GetAccountants();
  assistants$: Observable<vEmployeeTeam[]> =
    this.empTasksService.GetAssistants();
  // tasks$: Observable<ITask[]> = this.empTasksService.GetEmpTasks();
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

  selectedUserFilter: number = 0;
  userTypeLabels = ["მენეჯერები", "ბუღალტრები", "დამხმარეები"];
  ngOnInit(): void {
    this.checkUserRole();

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

  userId: number = 0;
  isAdmin: boolean = false;
  isManager: boolean = false;
  isAssistant: boolean = false;
  checkUserRole() {
    Authuser.getUserData((data) => {
      this.isAdmin = data.isAdmin;
      this.userId = data.userId;
      if (this.isAdmin) {
        this.userTypeLabels = ["მენეჯერები", "ბუღალტრები", "დამხმარეები"];
        return;
      }
      this.managers$.subscribe((data: Array<any>) => {
        this.isManager = data.find((a) => a.userId == this.userId) != null;
        if (this.isManager) {
          this.userTypeLabels = ["ბუღალტრები", "დამხმარეები"];
          return;
        }
        this.userTypeLabels = ["დამხმარეები"];

        this.assistants$.subscribe((dt: Array<any>) => {
          this.isAssistant = dt.find((a) => a.userId == this.userId) != null;
          if (this.isAssistant) {
            var i = this.statuses.findIndex((q) => q.id == 2); // დასრულებული არ უნდა ქონდეთ დამხმარეებს
            if (i > -1) this.statuses.splice(i, 1);
            this.userTypeLabels = null;
          }
        });
      });
    }, true);
  }
  GetTasks() {
    // setting default filters
    var fp = new FilterParam();
    fp.FieldName = "taskCategoryId";
    fp.DataType = DataType.String;
    fp.FilterType = Number(0);
    fp.FilterValue = "";
    this.applyFilters(fp, false);
    var fp = new FilterParam();
    fp.FieldName = "ManagerUserId";
    fp.DataType = DataType.String;
    fp.FilterType = Number(0);
    fp.FilterValue = "0";
    this.applyFilters(fp, false);

    var fp = new FilterParam();
    fp.FieldName = "ActiveMonth";
    fp.DataType = DataType.String;
    fp.FilterType = Number(0);
    fp.FilterValue = String(this.currentMonth - 1);
    this.applyFilters(fp, false);

    var fp = new FilterParam();
    fp.FieldName = "ActiveYear";
    fp.DataType = DataType.String;
    fp.FilterType = Number(0);
    fp.FilterValue = String(this.currentYear);
    this.applyFilters(fp);

    // usable only getemptasksF
    // this.Tasks = [];
    // this.loading = true;
    // this.empTasksService.GetEmpTasks().subscribe((x) => {
    //   this.Tasks = x;
    //   this.loading = false;
    //   this.BuildCommonTasks(x);
    // });
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
  applyFilters(event: FilterParam, reloadData: boolean = true) {
    if (event != null) {
      var i = this.filters.findIndex((x) => x.FieldName == event.FieldName);
      if (i > -1) this.filters.splice(i, 1);
      this.filters.push(event);
    }
    if (reloadData == true) {
      this.loading = true;

      this.empTasksService.GetEmpTasksF(this.filters).subscribe(
        (x) => {
          this.Tasks = x;
          this.loading = false;
          this.clientCompanies$ = this.empTasksService.GetClientCompanies(
            this.managerFilterId
          );

          this.BuildCommonTasks(x);
        },
        (err) => {
          this.loading = false;
        }
      );
    }
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
  showSettings: boolean = false;

  showComments: boolean = false;
  selectedChecklistDiv: HTMLElement = null;
  selectedChecklistId: number = 0;
  checklistComments: Comment[] = [];
  typeComment: string = "";

  showSettingsPopup(task: ITask, checklistDiv: HTMLElement) {
    this.showSettings = true;
    this.selectedChecklistDiv = checklistDiv;
    if (!checklistDiv.classList.contains("selected"))
      checklistDiv.classList.add("selected");
    this.selectedChecklistId = task.id;
  }

  showCommentsPopup(task: ITask, checklistDiv: HTMLElement) {
    this.showComments = true;
    this.selectedChecklistDiv = checklistDiv;
    if (!checklistDiv.classList.contains("selected"))
      checklistDiv.classList.add("selected");
    this.selectedChecklistId = task.id;
    this.getComments(task.id);
  }
  getComments(checklistId: number) {
    this.empTasksService.GetComments(checklistId).subscribe((data: any) => {
      this.checklistComments = <Comment[]>data;
    });
  }
  addComments() {
    this.empTasksService
      .AddComment(this.selectedChecklistId, this.typeComment)
      .subscribe((data: any) => {
        this.getComments(this.selectedChecklistId);
      });
    this.typeComment = "";
  }

  closeComments() {
    if (this.selectedChecklistDiv.classList.contains("selected"))
      this.selectedChecklistDiv.classList.remove("selected");
    this.checklistComments = [];
    this.selectedChecklistId = 0;
    this.typeComment = "";
  }
  onKeyPress(event) {
    if (this.selectedChecklistId > 0)
      if (event.code == "Enter") {
        this.addComments();
        event.preventDefault();
      }
  }
}
