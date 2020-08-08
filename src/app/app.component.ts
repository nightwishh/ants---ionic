import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Authuser } from './common/authuser';
import { CommonService } from './common/common.service';
import {  Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AccountAnts';
  userLoggedIn:Boolean =false;
  isBxUser:boolean = false;
  showBxNotAuthorized:boolean = false;
  constructor(private commonService:CommonService) {
    this.userLoggedIn = Authuser.userLoggedIn();
    this.isBxUser = Authuser.bxToken.length > 0
  }
}

