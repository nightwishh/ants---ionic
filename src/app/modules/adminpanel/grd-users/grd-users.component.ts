import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GrdUsersService } from './services/grd-users.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { getuid } from 'process';

@Component({
  selector: 'app-grd-users',
  templateUrl: './grd-users.component.html',
  styleUrls: ['./grd-users.component.css']
})
export class GrdUsersComponent implements OnInit {

  constructor(private usersService:GrdUsersService) { }
  @Output() onRowClick:EventEmitter<any> = new EventEmitter<any>();
  dataSource = new MatTableDataSource();
  displayedColumns = ['name', 'email', 'phone', 'bxEmail'];
  @ViewChild("paginator",{static:false}) paginator:MatPaginator;
  ngOnInit(): void {
    
  }
  showLoader:boolean = false;
  ngAfterViewInit() {
    // this.getUsers();
  }
  // getUsers() {
  //   this.showLoader = true;
  //   this.usersService.pageSize = this.paginator.pageSize;
  //    this.usersService.getUsers().toPromise().then(data=> {
  //      console.log(data);
  //     this.dataSource.data = data["rootElement"].DATA.Rows;
  //     // this.dataSource.paginator = this.paginator;
  //     this.paginator.length = data["rootElement"].DATA.Count;
  //     this.showLoader = false;
  //    });
  // }
  userRowClick(event) {
    this.onRowClick.emit(event);
  }
  // onPage(event:PageEvent) {
  //   this.usersService.page = event.pageIndex + 1;
  //   // this.getUsers();
  // }
}
