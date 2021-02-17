import { Component, OnInit } from '@angular/core';
import { EmpTasksService } from 'src/app/services/emp-tasks.service';
import { ClientCompany, CommonTask, Task } from './models/emptasks';

@Component({
  templateUrl: './emptasks.component.html',
  styleUrls: ['./emptasks.component.css']
})
export class EmptasksComponent implements OnInit {

  constructor(private empTasksService:EmpTasksService) { }
  CommonTasks:CommonTask[] = [];
  Tasks:Task[] = [];
  ClientCompanies:ClientCompany[] = [];
  ngOnInit(): void {
    this.empTasksService.GetCommonTasks().subscribe(x=> {
      this.CommonTasks = x;
    });
    this.empTasksService.GetEmpTasks().subscribe(x=> {
      this.Tasks = x;
      console.log(this.FilterTasksByCompany(3))
    });
    this.empTasksService.GetClientCompanies().subscribe(x=> {
      this.ClientCompanies = x;
    });
  }
  FilterTasksByCompany(id:number):Task[] {
    return this.Tasks.filter(x=>x.clientCompanyId == id);
  }

}
