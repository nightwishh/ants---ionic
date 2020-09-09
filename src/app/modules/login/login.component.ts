import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UserCredentials, UserRegistration } from '../models/user.model';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userCredentials:UserCredentials = new UserCredentials();
  userRegistration:UserRegistration  = new UserRegistration();
  constructor(private commonService:CommonService, private route:ActivatedRoute) { 
    var tab = route.snapshot.params["id"];
    if (tab == 1) this.isRegistration = true;
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
