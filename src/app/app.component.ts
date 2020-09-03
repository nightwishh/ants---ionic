import { Component, OnInit, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Authuser } from "./common/authuser";
import { CommonService } from "./common/common.service";
import { Location } from "@angular/common";
// import { Push, PushObject, PushOptions } from "@ionic-native/push/ngx";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "AccountAnts";
  userLoggedIn: Boolean = false;
  isBxUser: boolean = false;
  showBxNotAuthorized: boolean = false;
  // constructor(private push: Push, private platform: Platform) {
  constructor() {

    this.userLoggedIn = Authuser.userLoggedIn();
    this.isBxUser = Authuser.bxToken.length > 0;

    // if (this.platform.ready().then(x=> {

    // }))
  }
  ngOnInit() {
    // setTimeout(() => {
    //   console.log("Hey");
    //   if (this.platform.is("android") || this.platform.is("ios"))
    //   this.pushSetup();
    // }, 100);
  }

  /*
  pushSetup() {
    this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        console.log("We have permission to send push notifications");
      } else {
        console.log("We do not have permission to send push notifications");
      }
    });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push
      .createChannel({
        id: "testchannel1",
        description: "My first test channel",
        // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
        importance: 3,
        //badge is used to if badge appears on the app icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
        //false = no badge on app icon.
        //true = badge on app icon
        badge: false,
      })
      .then(() => console.log("Channel created"));

    // Delete a channel (Android O and above)
    this.push
      .deleteChannel("testchannel1")
      .then(() => console.log("Channel deleted"));

    // Return a list of currently configured channels
    this.push
      .listChannels()
      .then((channels) => console.log("List of channels", channels));

    const options: PushOptions = {
      android: {
        senderID: "761421669073",
        forceShow:true
      },
      ios: {
        alert: "true",
        badge: true,
        sound: "false",
      },
      // windows: {},
      // browser: {
      //     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      // }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject
      .on("notification")
      .subscribe((notification: any) =>
        console.log("Received a notification", notification)
      );

    pushObject
      .on("registration")
      .subscribe((registration: any) =>
        console.log("Device registered", registration)
      );

    pushObject
      .on("error")
      .subscribe((error) => console.error("Error with Push plugin", error));
  }
  */
}
