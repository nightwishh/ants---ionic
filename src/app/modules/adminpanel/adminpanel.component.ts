import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';
import { ActivatedRoute } from '@angular/router';
import { Users } from './grd-users/services/grd-users.service';
export class newBxUser {
  antsUserID:number = null;
  email:string = null;
  password:string = null;
  antsEmail:string = null;
  refreshToken:string = "";
  accessToken:string = "";
  hasBitrix:boolean = false;
}

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  newBxUser:newBxUser = new newBxUser();
  tab:number = 2; // tab 1 = Grid of Users, tab 2 = editing of Users
  editingTab:number = 1; // 1 Bitrix, 2 - 1C
  constructor(private commonService:CommonService, private route:ActivatedRoute) {
    this.checkAdmin();
  }
  user1C:User1C = new User1C();
  ngOnInit(): void {
    setInterval(() => {
      if (this.newBxUser.hasBitrix) return;
      try {
        // var ifr = document.getElementById("ifr") as HTMLIFrameElement;
        // var ifrDoc = (ifr.contentWindow || ifr.contentDocument) as any;
        // this.newBxUser.refreshToken = String(ifrDoc["document"].getElementById("refreshToken").value);
        // this.newBxUser.email = String(ifrDoc["document"].getElementById("email").value);
        if (String(this.commonService.getCookie("newBxRefreshToken")).length == 0) return;
        this.newBxUser.accessToken = String(this.commonService.getCookie("newBxAccessToken"));
        this.newBxUser.refreshToken = String(this.commonService.getCookie("newBxRefreshToken"));
        this.newBxUser.email = String(this.commonService.getCookie("newBxEmail"));
      }
      catch{}
    }, 2000);
  }
  saveNewBxUser() {
    this.commonService.post("Users/SetBxUser",this.newBxUser,() => {
      alert("ოპერაცია წარმატებით დასრულდა");
      location.href = "/";
    })
  }
  deleteNewBxUser() {
    this.commonService.post("Users/DeleteBxUser",this.newBxUser,() => {
      alert("ოპერაცია წარმატებით დასრულდა");
      location.href = "/";
    })
  }
  isAdmin:boolean = false;
  checkAdmin() {
      Authuser.getUserData((data => {
        console.log(data);
        this.isAdmin = data.isAdmin;
      }),true);
    }
    save1CUser() {
      this.commonService.post("OneC/SetUser",this.user1C,()=> {
        alert("ოპერაცია წარმატებით დასრულდა");
        location.href = "/";
      })
    }
  editingTabSelected(id:number) {
    return this.editingTab == id;
  }
  onRowClick(event:Users) {
    this.newBxUser.antsUserID = event.ID;
    this.newBxUser.email = event.bxEmail;
    this.newBxUser.antsEmail = event.email;
    this.newBxUser.hasBitrix = event.has_bx;
    this.user1C.antsEmail = event.email;
    this.tab = 1;
  }
}
export class User1C {
  public antsEmail:string = "";
  public username:string = "";
  public password:string = "";
}