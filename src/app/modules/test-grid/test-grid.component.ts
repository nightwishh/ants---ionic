import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GrdUsersService, Users } from '../adminpanel/grd-users/services/grd-users.service';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-grid',
  templateUrl: './test-grid.component.html',
  styleUrls: ['./test-grid.component.css']
})
export class TestGridComponent implements OnInit, AfterViewInit {

  constructor(private usersService:GrdUsersService) { }
  dataSource = new MatTableDataSource();
  dt:Users[] = [];
  dtObs:Observable<Users[]> = Observable.create();
  displayedColumns = ['name','name', 'email', 'phone', 'bxEmail'];
  @ViewChild("grd",{static:false}) myGrid:GridComponent;
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.dataSource.data.push({field1:"F1",field2:"F2"})
    this.dataSource.data.push({field1:"F2",field2:"F3"})
    this.dtObs = this.usersService.getUsers();
    // .toPromise().then((data)=> {
    //   console.log(data["rootElement"]["DATA"]["Rows"]);
    //   this.dt = data["rootElement"]["DATA"]["Rows"];
    // })
  }

}
