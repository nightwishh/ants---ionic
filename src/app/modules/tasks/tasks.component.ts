import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, HostBinding } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Task, Comment, attachedObject } from './models/task';
import { Authuser, bxWgUsers } from 'src/app/common/authuser';
import { Calendar } from 'src/app/common/calendar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ReturnStatement } from '@angular/compiler';
import { AppComponent } from 'src/app/app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { InputComponent } from 'src/app/components/input/input.component';
import { HttpParams } from '@angular/common/http';
import { PatternValidator } from '@angular/forms';
import { element } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/common/common-functions';
import { start } from 'repl';

// export class Task {
//   id:number;
//   title:string;
//   deadline:string;
//   createdByName:string;
//   createdByLastName:string;
//   get createdBy() {
//     return this.createdByName + this.createdByLastName;
//   }
//   group:[{}];
//   responsiblePerson:[{}];
// }

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(private commonService:CommonService, private calendar:Calendar, private route:ActivatedRoute, private router:Router) {
    this.route.params.subscribe(params => {
      if (params["id"] != null) {
        var task = new Task();
        task.id = params["id"];
        this.showTaskDetails(task);
      }
    });
   }
  displayCols:string[] = ['id','title','status','deadline','created_by','responsible','create_date','status_changed_date'];
  dataSource:MatTableDataSource<Task> = new MatTableDataSource<Task>();
  dataSourceReverse:MatTableDataSource<Task> = new MatTableDataSource<Task>();

  showNewTaskPopup:boolean = false;
  value:string="";
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // MatPaginatorIntl
  newTask:Task = new Task();
  workgroup = Authuser.workgroup;
  @HostBinding('class.notAuthorized')
  notAuthorized:string = Authuser.bxToken.length > 0 ? "" : "notAuthorized";
  // wgUsers:bxWgUsers[] = Authuser.workgroup.users;
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    if (Authuser.workgroup.active)
    this.getTaskList();
    else
    Authuser.workgroup.onWorkGroupChange.push(this.getTaskList.bind(this));
    
    this.dataSource.filterPredicate = (data: Task, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
      });
        return matchFilter.every(Boolean);
    };

    if (this.isMobile()) {
      this.displayCols = ['title','status','deadline'];
    }
    if (Authuser.bxToken.length == 0 && this.commonService.getCookie("questionnaire") != "1") {
      setTimeout(() => {
        location.href = "/OrgDetails";
      }, 7000);
    }

  }
  totalTasks:number = 0;
  getTaskList(startID:number = 0) {
    var fieldsList = ["ID","TITLE","DEADLINE","CREATED_BY","CREATOR",'RESPONSIBLE_PERSON',"GROUP","CREATED_DATE","STATUS","NEW_COMMENTS_COUNT","*"];
    var params = new Object();
    params["select"] = fieldsList;
    // params["order[ID]"] = "asc"
    // params["select"] = fieldsList.join(",");
    // params["filter[GROUP_ID]"] =Authuser.workgroup.active ? "&filter[GROUP_ID]=" + Authuser.workgroup.ID : "";
    
    var group = {};
    var filterByWorkgroup = Authuser.workgroup.active ? "?order[id]=desc&filter[GROUP_ID]=" + Authuser.workgroup.ID : "";
    var filter = filterByWorkgroup;

    if (startID > 0) filter += "&filter[<ID]=" + startID;
    // var result:TaskList./Result
    this.dataSource.paginator = this.paginator;
    this.commonService.postBX("tasks.task.list" + filter,params,(data) => {
      if (startID == 0) {
      this.totalTasks = data.total;
      this.dataSource.data = data.result.tasks;
      }
      else
      this.dataSource.data = this.dataSource.data.concat(data.result.tasks);
      // this.dataSource.data = this.dataSource.data.reverse(); // orders by desc (newer first)
    },null,true);
  }
  pageChanged(x) {
    if (this.paginator.length > this.dataSource.data.length && x.pageIndex >= (Math.ceil(x.length / x.pageSize) - 2)) 
    this.getTaskList(this.dataSource.data[this.dataSource.data.length - 1].id)

  }
  toDate(dateStr) {
    return this.calendar.toGeoDate(dateStr);
  }

  applyFilter(filterID:string,filterValue:string) {
    var tableFilters = [];
    tableFilters.push({id:filterID,value:filterValue});

    // this.dataSource.data = this.dataSource.data.filter(x=>x.id = Number(filterValue));
    this.dataSource.filter = JSON.stringify(tableFilters);
    
    this.dataSource.paginator.firstPage();
  }

  saveNewTask() {
    if (this.newTask.title == null) return;
    
    var groupIDFilter = Authuser.workgroup.active ? "&fields[GROUP_ID]=" + Authuser.workgroup.ID : "";
    var titleFilter = "?fields[TITLE]=" + this.newTask.title;
    var descrFilter = "&fields[DESCRIPTION]=" + encodeURI(this.newTask.description);
    var responsibleFilter = "&fields[RESPONSIBLE_ID]=" + (this.newTask.responsibleId == null || this.newTask.responsibleId.length == 0 ? Authuser.bxUserID : this.newTask.responsibleId);
    var taskID = (this.newTask.id > 0) ? "&taskId=" + this.newTask.id : ""; 
    var deadlineFilter = "&fields[DEADLINE]=" + (this.newTask.deadline == null ? "" : this.newTask.deadline.toJSON());
    var filter = titleFilter + descrFilter + responsibleFilter + groupIDFilter + deadlineFilter + taskID;

    var taskActionUrl = this.newTask.id > 0 ? "tasks.task.update" : "tasks.task.add";
  
    if (!this.newTask.title || !this.newTask.description || Number(this.newTask.responsibleId) == 0 || this.newTask.deadline == null) 
    {
      alert("გთხოვთ შეავსოთ ყველა ველი");
      return;
    }

    this.commonService.getBX(taskActionUrl + filter,{},() => {
        this.reloadTasks();
      })
  }
  @ViewChild("taskDescription",{static:false}) taskDescription:InputComponent;
  addNewTask() {
    this.showNewTaskPopup = true;
    this.newTask.editing = true;
  }
  showTaskDetails(row:Task) {
    var taskID = row.id;
    // var select = "?select=ID,TITLE,DEADLINE,CREATED_BY,RESPONSIBLE_PERSON,GROUP,CREATED_DATE,STATUS";
    var filter = "?taskId=" + taskID;
    this.commonService.getBX("tasks.task.get" + filter,{},(data) => {
      var task = data.result.task;
      this.newTask = new Task();
      this.newTask.title = task.title;
      this.newTask.id = task.id;
      this.newTask.status = task.status;
      this.newTask.description = task.description;
      this.newTask.responsibleId = task.responsibleId;
      this.newTask.deadline = new Date(task.deadline);
      this.newTask.ufTaskWebdavFiles = task.ufTaskWebdavFiles;
      if (this.newTask.ufTaskWebdavFiles.toString() != "false" && this.newTask.ufTaskWebdavFiles.length > 0) {
        this.getTaskFiles(this.newTask.ufTaskWebdavFiles);
      }
      this.taskDescription.richTextFunction = (text:string) => {
        if (this.newTask.attachedFiles.length > 0) {
          this.newTask.attachedFiles.forEach(element => {
            var replaceObj = "";
            if (element.isImage)
            replaceObj = "<br /><img class='imgPreview' src='" + element.download_url + "'><br />";
            else 
            replaceObj = "<br /><a href='" + element.download_url + "'>" + element.name + "</a><br />";

            text = text.replace("[DISK FILE ID=" + element.id + "]", replaceObj);
            text = text.replace("[DISK FILE ID=n" + element.object_id + "]", replaceObj);
          });
        }
        return text;
      }
      // this.newTask.editing = true;
      this.showNewTaskPopup = true;
      this.getComments();
    });
  }
  getTaskFiles(fileIDs:[]) {
    this.newTask.attachedFiles = [];
    fileIDs.forEach(x=> {
      this.commonService.getBX("disk.attachedObject.get?id=" + x,{},(data) => {
        var obj = new attachedObject();
        obj.id = data.result.ID;
        obj.object_id = data.result.OBJECT_ID;
        obj.name = data.result.NAME;
        obj.download_url = data.result.DOWNLOAD_URL;
        obj.detail_url = data.result.DETAIL_URL;
        obj.size = data.result.SIZE;
        this.newTask.attachedFiles.push(obj);
      })
    })
  }
  // getImageData() {
  //   var x = new Image().src = "aa";
  //   x.
  // }
  completeTask() {
    this.commonService.getBX("tasks.task.complete?taskId=" + this.newTask.id,{},(data) => {
      this.reloadTasks();
    });
  }
  newTaskPopupHide() {
    this.showNewTaskPopup = false;
    this.showCommentsPopup = false;
    this.newTask = new Task();
    
    new CommonFunctions().clearUrlParameters(this.router,this.route);

  }
  showCommentsPopup:boolean = false;
  allComments:Object[] = [];
  showComments() {
    this.showCommentsPopup = true;
    this.getComments();
  }
  getComments() {
    if (this.newTask.id == null) return;
    this.commonService.getBX("task.commentitem.getlist?taskId=" + this.newTask.id,{},(data) => {
      this.allComments = data.result;
      // Remove bitrix Unknown System Comments
      var indexOfRemoveItem = -2;
      while (indexOfRemoveItem > -1 || indexOfRemoveItem == -2) {
      indexOfRemoveItem = this.allComments.findIndex(x=>x["POST_MESSAGE"] == "commentAuxTaskInfo");
      if (indexOfRemoveItem > -1)
      this.allComments.splice(indexOfRemoveItem,1);
      }
      var lastComment:any = this.allComments[this.allComments.length - 1];
      this.newTask.lastComment = new Comment(lastComment["AUTHOR_NAME"],lastComment["POST_MESSAGE"],lastComment["POST_DATE"])
       
      this.allComments[this.allComments.length - 1]["POST_MESSAGE"].toString();
    });
  }
  addComment() {
    if (this.newTask.newComment == null || this.newTask.newComment.length == 0 || this.newTask.id == null || this.newTask.id == 0) {
      alert("შეავსეთ კომენტარის ველი");
      this.newTask.newComment = "";
      return;
    }
    var params = new Array();
    params["FIELDS[POST_MESSAGE]"] = this.newTask.newComment;
    this.commonService.getBX("task.commentitem.add?taskId=" + this.newTask.id,params,() => {
      this.showCommentsPopup = false;
      alert("ოპერაცია წარმატებით დასრულდა");
    })
  }

  workGroupActive() {
    return Authuser.workgroup.active;
  }

  getStatusName(status:number) {
    var filterStatus = Task.statuses.filter(x=>x.value == Number(status));
    if (filterStatus != null)
    return filterStatus[0]["nameGeo"];
    else
    return status;
  }
  canEdit() {
    if (Number(this.newTask.id) > 0 && Number(this.newTask.status) != 5) 
    return true;
    else if (Number(this.newTask.id == 0) || this.newTask.id == null) // თუ ახალს ვაკეთებ
    return true;

    return false;
  }
  canDelete() {
    if (Number(this.newTask.id) > 0 && Number(this.newTask.status) != 5) return true;

    return false;
  }
  canComment() {
    if (Number(this.newTask.id) > 0) return true;
    
    return false;
  }
  canFinish() {
    if (this.canEdit() && this.newTask.status != 5 && this.newTask.id > 0) return true;
    else return false;
  }
  deleteTask(taskID) {
    var confirm = window.confirm("ნამდვილად გსურთ ამოცანის წაშლა?");
    if (confirm)
    this.commonService.getBX("tasks.task.delete?taskId=" + taskID,{},(data)=> {
      this.reloadTasks();
    },err=>location.reload());
  }
  isMobile() {
    const mq = window.matchMedia("(max-width: 460px)");
    if (mq.matches)
    return true;

    return false;
  }
  reloadTasks() {
    this.newTaskPopupHide();
    this.getTaskList();
    // this.getTaskList();
  }

}


