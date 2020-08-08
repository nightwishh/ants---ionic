import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';
import { ActivatedRoute } from '@angular/router';
import { Users } from './grd-users/services/grd-users.service';
export class newBxUser {
  email:string = null;
  password:string = null;
  antsEmail:string = null;
  refreshToken:string = "";
}

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  newBxUser:newBxUser = new newBxUser();
  tab:number = 2;
  constructor(private commonService:CommonService, private route:ActivatedRoute) {
    this.checkAdmin();
  }
  
  ngOnInit(): void {
    setInterval(() => {
      try {
        var ifr = document.getElementById("ifr") as HTMLIFrameElement;
        var ifrDoc = (ifr.contentWindow || ifr.contentDocument) as any;
        this.newBxUser.refreshToken = String(ifrDoc["document"].getElementById("refreshToken").value);
        this.newBxUser.email = String(ifrDoc["document"].getElementById("email").value);
      }
      catch{}
    }, 2000);
  }
  saveNewBxUser() {
    this.commonService.post("Users/SetBxUser",this.newBxUser,() => {
      alert("ოპერაცია წარმატებით დასრულდა");
    })
  }
  deleteNewBxUser() {
    this.commonService.post("Users/DeleteBxUser",this.newBxUser,() => {
      alert("ოპერაცია წარმატებით დასრულდა");
    })
  }
  isAdmin:boolean = false;
  checkAdmin() {
      Authuser.getUserData((data => {
        console.log(data);
        this.isAdmin = data.isAdmin;
      }),true);
    }

  onRowClick(event:Users) {
    this.newBxUser.antsEmail = event.email;
    this.tab = 1;
  }
}
