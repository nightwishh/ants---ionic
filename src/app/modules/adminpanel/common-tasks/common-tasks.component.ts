import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Calendar } from "src/app/common/calendar";
import { CommonFunctions } from "src/app/common/common-functions";
import { EmpTasksService } from "src/app/services/emp-tasks.service";
import {
  CommonTask,
  ICommonTask,
  ITaskCategory,
} from "../../emptasks/models/emptasks";

@Component({
  selector: "app-common-tasks",
  templateUrl: "./common-tasks.component.html",
  styleUrls: ["./common-tasks.component.css"],
})
export class CommonTasksComponent implements OnInit {
  constructor(private calendar: Calendar, private emptask: EmpTasksService) {}
  addNewTask: boolean = false;
  activeMonths: Object[] = [];
  loading: boolean = false;
  taskCategories$: Observable<ITaskCategory> = this.emptask.GetCategories();
  ngOnInit(): void {
    this.activeMonths = this.geoMonths.map((obj) => {
      obj["checked"] = false;
      return obj;
    });
  }
  public geoMonths = this.calendar.geoMonths;

  commonTask: CommonTask = new CommonTask();

  clearNewTask() {
    this.commonTask = new CommonTask();
  }

  saveCommonTask() {
    console.log(this.commonTask);
    if (this.commonTask.name == null) {
      alert("შეიყვანეთ დასახელება.");
      return;
    }
    if (this.commonTask.taskCategoryId == null) {
      alert("აირჩიე თასქის კატეგორია");
      return;
    }
    if (
      this.commonTask.activeStartMonth == null ||
      this.commonTask.activeStartMonth <= 0 ||
      this.commonTask.activeStartMonth > this.commonTask.activeEndMonth
    ) {
      alert("გთხოვთ სწორად შეიყვანეთ აქტიური პერიოდი.");
      return;
    }
    if (
      this.commonTask.activeEndMonth == null ||
      this.commonTask.activeEndMonth <= 0
    ) {
      alert("გთხოვთ სწორად შეიყვანეთ აქტიური პერიოდი.");
      return;
    }
    this.loading = true;
    this.emptask.AddCommonTask(this.commonTask).subscribe(
      (x) => {
        location.reload();
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }
  deleteCommonTask(row) {
    if (!confirm("ნამდვილად გსურთ თასქის წაშლა?")) return;
    var commonTask = (({ Id, Name, taskCategoryId }) => ({
      Id,
      Name,
      taskCategoryId,
    }))(row);
    this.loading = true;
    this.emptask
      .DeleteTask(new CommonFunctions().serializeObjToQuery(commonTask))
      .subscribe((x) => {
        location.reload();
      });
  }
  fileSelected(files: FileList) {
    var fileToUpload: File | null = null;
    fileToUpload = files.item(0);
    this.loading = true;
    this.emptask.UploadCommonTasksExcel(fileToUpload).subscribe(
      (x) => {
        alert("ექსელი წარმატებით აიტვირთა");
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
