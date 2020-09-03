import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Authuser, bxWorkgroup, bxWgUsers } from 'src/app/common/authuser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workgroups',
  templateUrl: './workgroups.component.html',
  styleUrls: ['./workgroups.component.css']
})
export class WorkgroupsComponent implements OnInit {
  workgroups:bxWorkgroup[];
  constructor(private commonService:CommonService, private route:ActivatedRoute, private router:Router) { 
    // var paraneters = {
    //   'FILTER[NAME]':"da"
    // }
    this.commonService.getBX("sonet_group.get",{},(data) => {
      this.workgroups = data.result;
      this.setWorkgroup(Authuser.workgroup.ID);
    }); // get workgroups
  }

  setWorkgroup(id:number) {
    if (id == null || id == undefined || id == 0) {
      Authuser.workgroup.ID = this.workgroups[0].ID;
      this.changeWorkgroup(0);
    }
    else
    this.changeWorkgroup(this.workgroups.findIndex(x=>x.ID == id));
  }

  changeWorkgroup(index) {
      Authuser.workgroup.name = this.workgroups[index]["NAME"].toString();
      Authuser.workgroup.subjectName = this.workgroups[index]["SUBJECT_NAME"].toString();
      Authuser.workgroup.ownerID =this.workgroups[index]["OWNER_ID"].toString();
      Authuser.workgroup.numberOfMembers = this.workgroups[index]["NUMBER_OF_MEMBERS"].toString();
      
      Authuser.workgroup.users = [];
    this.commonService.getBX("sonet_group.user.get?ID=" + Authuser.workgroup.ID,{},(data) => {
      var usersToGet = [];
      data.result.forEach(element => {
        usersToGet.push(element.USER_ID);
      }); // get users from that workgroup
      this.commonService.getBX("im.user.list.get?ID=[" + usersToGet.toString() + "]",{},(users) => {
        usersToGet.forEach(index => {
          var user = new bxWgUsers();
          user.ID = users.result[index].id;
          user.name = users.result[index].name;

          Authuser.workgroup.users.push(user);
          Authuser.workgroup.onWorkGroupChange.forEach(element => {
            if (element != null && element instanceof Function) 
            element();
          });
        

        })
      },null,false) // get UserInfo from selected wg users
    },null, false);
  }

  selectedWorkGroup() {
    return Authuser.workgroup.active ? Authuser.workgroup.ID : null;
  }

  changeWorkgroupCookie(index) {
    Authuser.workgroup.ID = Number(this.workgroups[index]["ID"].toString());
    //location.href = "/";
    // var id = this.route.snapshot.params["id"];
    location.href = this.router.url.split("/")[1];
  }
  ngOnInit(): void {
  }

  addCompany() {
    location.href = "/OrgDetails"
  }

}
