import { Component, OnInit, Input, Injectable, ChangeDetectorRef, HostBinding } from '@angular/core';
import { ActivatedRoute, Navigation, Router, RoutesRecognized } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { CommonService } from 'src/app/common/common.service';
import { Authuser, Module } from 'src/app/common/authuser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
@Injectable({
  providedIn: 'root',
 })
export class HeaderComponent implements OnInit {

  @Input() logoPosition = "left";
  @HostBinding("attr.expandMenu")
  expandMenu:boolean = false;
  @HostBinding("attr.sideBar")
  @Input() sideBar:boolean = true;

  @HostBinding("attr.workgroup")
  get workgroup():Boolean {
    return this.authUser.workgroup.active;
  }
  
  @HostBinding("attr.expandUserMenu")
  expandUserMenu:boolean = false;


  notificationsCounter:Object[] = [{moduleID:0,counter:0}];
  modules:Module[];
  authUser = Authuser;
  constructor(private router:Router, private route:ActivatedRoute, private commonService:CommonService) { 
    Authuser.getUserData();
    Authuser.getUserModules();
    this.getChatNotificationsService();

  }

  ngOnInit(): void {
    setInterval(() => {
      Authuser.getUserData(null,true);
      Authuser.getUserModules();
    }, 300000) // 5 minutes
    setInterval(() => {
      this.getChatNotificationsService();
    },10000)
  }
  navigate(route:string) {
    const mq = window.matchMedia("(max-width: 460px)");
    if (mq.matches)
    this.expandMenu = false;
    this.expandUserMenu = false;
    this.router.navigate([route]);
  }
  logoClick() {
    location.href = "/";	
  }
  logout() {
    this.authUser.logout();
  }

  tabSelected(module:Module) {
    if (module.url == location.pathname || location.pathname.match(module.url + "/"))
     return true;
  }

  moduleHasNotifications(module:Module) {
    if (module.url.includes("Chat"))
      return true;
    // return true;
  }
  getNotifications(moduleID:number, returnObject=false):number | Object {
    var notif = this.notificationsCounter.find(x=>x["moduleID"] == moduleID);

    if (returnObject)
      return notif;

    if (notif != null && notif["counter"] != null)
      return notif["counter"];
    else 
      return 0;
  }

  getChatNotificationsService() {
    if (this.commonService.getCookie("bxat") == null || this.commonService.getCookie("bxat").length == 0) return;

    this.commonService.getBX("im.counters.get",{},(data) => {
      var chatCounter = (data.result.TYPE.CHAT + data.result.TYPE.DIALOG) | 0;

      var notif = this.getNotifications(1,true); // if notifs are already here then update - not push
      if (notif != null)
          notif["counter"]=chatCounter;
      else
        this.notificationsCounter.push({moduleID:1,counter:chatCounter}); // chat
    },null,false);
  }
  reload() {
    location.reload();
  }
  public get currentPage():string { 
    var url = location.pathname;
    
    if (this.authUser.modules == null) return "";

    var module = this.authUser.modules.find(x=>x.url == url || url.match(x.url + "/"));
    if (module != null) return module.moduleName;

    return "";
  }

  getCurrentPageTitle() {

      // this.router.events.subscribe(data=> {
      //   if (data instanceof RoutesRecognized) {
      //     var url = (data as RoutesRecognized).url;
        
          if (this.authUser.modules == null) return "";
        
      //     var module = this.authUser.modules.find(x=>x.url == url || url.match(x.url + "/"));
      //     this.currentPage = module.moduleName;
      //     return module.moduleName; 
      //   }
      // });
      return this.currentPage;
  }

}
