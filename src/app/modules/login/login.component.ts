import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UserCredentials, UserRegistration } from '../models/user.model';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userCredentials:UserCredentials = new UserCredentials();
  userRegistration:UserRegistration  = new UserRegistration();
  constructor(private commonService:CommonService) { 

  }
  isRegistration:boolean = false;
  ngOnInit(): void {

  }

  authenticate() {
    this.commonService.authenticate("Users/Authenticate",this.userCredentials);
  }
  register() {
    this.commonService.authenticate("Users/Register",this.userRegistration);
  }

}
