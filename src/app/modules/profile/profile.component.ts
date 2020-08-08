import { Component, OnInit } from '@angular/core';
import { Authuser } from 'src/app/common/authuser';
import { UserRegistration, UserProfile, UserPasswords } from '../models/user.model';
import { CommonService } from 'src/app/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private commonService:CommonService, private router:Router) {

   }
  user:UserProfile = new UserProfile();
  profile:UserProfile = new UserProfile();
  editing:boolean = false;
  changePasswordPopup:boolean = false;
  userPasswords:UserPasswords = new UserPasswords();
  ngOnInit(): void {
    this.commonService.post("Profile/GetUserProfile",{},(data) => {
      this.fillProfile(data);
      this.resetProfileDetails();
    })
  }
  fillProfile(data:any) {
    this.profile.fullName = data.DATA.fullName;
    this.profile.email = data.DATA.email;
    this.profile.phone = data.DATA.phone;
  }
  resetProfileDetails() {
    Object.assign(this.user,this.profile);
  }
  cancelChanges() {
    this.editing = !this.editing;
    this.resetProfileDetails();
  }
  changeUserProfileClick() {
    this.commonService.post("Profile/ChangeProfile",this.user,(data) => {
      window.alert(data.STATUS.TEXT);
      location.reload();
    })
  }
  changePasswordClick() {
    this.commonService.post("Profile/ChangePassword",this.userPasswords,(data) => {
      window.alert(data.STATUS.TEXT);
      location.reload();
    })
  }
  navigate(route) {
    this.router.navigate([route]);
  }

}
