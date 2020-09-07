import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class BxCountersService {

  constructor(private commonService:CommonService) { }
  public notifications:Notifications = new Notifications();
  async getNotifications() {
    if (this.commonService.getCookie("bxat") == null || this.commonService.getCookie("bxat").length == 0) return;

    await this.commonService.getBXAsync("im.counters.get",{},async (data) => {
      this.notifications.TYPE = <NotificationType>data["result"].TYPE;
      this.notifications.DIALOG = data["result"].DIALOG;
      this.notifications.CHAT = data["result"].CHAT;
      this.notifications.LINES = data["result"].LINES;
    },null,false);
  }
}
export class Notifications {
  public TYPE:NotificationType = new NotificationType();
  public DIALOG:Object = {};
  public CHAT:Object = {};
  public LINES:Object = {};
}
export class NotificationType {
  public ALL:number = 0;
  public NOTIFY:number = 0;
  public DIALOG:number = 0;
  public CHAT:number = 0;
  public LINES:number = 0;
}