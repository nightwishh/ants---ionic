import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import {
  UserRegistration,
  UserCredentials,
} from "../modules/models/user.model";
import { Authuser } from "./authuser";
import { Observable, throwError } from "rxjs";
// import { UserRegistration, UserCredentials } from '../modules/header/models/user.model';

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient, private cookie: CookieService) {}
  // Build command ng build --base-href / --prod
  get baseUrl(): string {
    if (location.href.includes("localhost")) {
      // return "https://apiants.azurewebsites.net/";
      // return "http://localhost:51731/";
      return "https://localhost:5002/";
    } else return "https://apiants.azurewebsites.net/";
    // return "http://antsge-001-site1.ctempurl.com/";
  }

  //  baseBxUrl:string = "https://b24-qbgwgy.bitrix24.com/rest/"
  baseBxUrl: string = "https://accountants.bitrix24.com/rest/";
  baseBxWebUrl: string = "https://accountants.bitrix24.com/";
  private httpOptions: Object = {};
  private headers;
  initHeaders() {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + this.getCookie("at"),
    });
    this.httpOptions = {
      headers: this.headers,
      reportProgress: true,
      responseType: "application/json" as "application/json",
    };
  }

  setCookie(name, value) {
    this.cookie.set(name, value, null, "/");
  }
  setCookieExpire(name, value, date: Date) {
    this.cookie.set(name, value, date, "/");
  }
  getCookie(name): string {
    return this.cookie.get(name);
  }
  removeCookie(name) {
    this.cookie.delete(name, "/");
  }
  updateCookie(name, value) {
    this.removeCookie(name);
    this.setCookie(name, value);
  }
  clearCookies() {
    this.cookie.deleteAll();
  }

  redirectToHome() {
    if (
      window.location.pathname.toString() != "/" &&
      window.location.pathname.toString() != "/Home" &&
      window.location.pathname.toString() != ""
    )
      window.location.href = "/";
  }

  handleErrors(err) {
    try {
      var error = JSON.parse(err.error);
    } catch {
      var error = err.error;
    }

    let errorMessage = "";
    if (typeof error.STATUS == "undefined") {
      // client-side error
      errorMessage = error.errors[Object.keys(error.errors)[0]];
      window.alert(errorMessage);
      return throwError(errorMessage);
    }

    if (error.STATUS.ID == -5) {
      // You are not authorized. please authorize first
      //this.redirectToLogin();
    }
    if (error.STATUS.ID == -6) {
      // Token incorrect. Destroy cookies
      this.clearCookies();
      window.location.href = "/";
    }

    if (error.STATUS.ID < 0 && error.STATUS.ID != -5 && error.STATUS.ID != -6)
      alert(error.STATUS.TEXT);

    return throwError(error.STATUS.TEXT);
  }
  handle;

  handleBxErrors(err) {
    if (err == null || err.error == null) return;
    if (err.error.error == "expired_token") {
      Authuser.getUserData(null, true);
      // alert("გთხოვთ თავიდან გაიაროთ ავტორიზაცია");
      // Authuser.logout();
      return;
    }
    if (err.ok == false) return "retry";
  }

  post(
    url: string,
    params: any = null,
    fnSuccess: Function = null,
    fnError: Function = null,
    showLoading: boolean = true,
    responseTypeJson: boolean = true
  ) {
    this.httpOptions = this.getHttpOptions();
    if (showLoading) this.requestLoader(true);

    var baseUrl = this.baseUrl;
    if (url.includes("http") || url.includes("https")) baseUrl = "";

    this.http
      .post(baseUrl + url, JSON.stringify(params), this.httpOptions)
      .subscribe(
        (response: any) => {
          if (showLoading) this.requestLoader(false);
          var data = response;
          if (responseTypeJson) {
            try {
              var json = JSON.parse(response);
            } catch {
              var json = response;
            }
            if (json.rootElement == null) data = json;
            else data = json.rootElement;
          }
          if (fnSuccess != null) fnSuccess(data);
        },
        (err) => {
          if (showLoading) this.requestLoader(false);
          console.log("Error: " + err);
          this.handleErrors(err);
          if (fnError != null) fnError(err);
        }
      );
  }

  getBXHttpOptions(params: any = {}) {
    if (
      this.getCookie("bxat").length == 0 &&
      (params["auth"] == null || params["auth"].length == 0)
    )
      return;

    var bxheaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
    });
    bxheaders.append("Access-Control-Allow-Origin", "*");
    if (params["auth"] != null && params["auth"].length > 0) {
    } else params["auth"] = this.getCookie("bxat");
    var httpOptions = {
      headers: bxheaders,
      params: params,
    };
    return httpOptions;
  }
  getBX(
    url: string,
    params: any = {},
    fnSuccess: Function = null,
    fnError: Function = null,
    showLoading: Boolean = true
  ) {
    var httpOptions = this.getBXHttpOptions(params);
    if (showLoading) this.requestLoader(true);

    this.http.get(this.baseBxUrl + url, httpOptions).subscribe(
      (response) => {
        this.requestLoader(false);
        // console.log(response);
        if (fnSuccess != null) fnSuccess(response);
      },
      (err) => {
        this.handleBxErrors(err);
        if (fnError != null) fnError(err);
      }
    );
  }
  async getBXAsync(
    url: string,
    params: any = {},
    fnSuccess: Function = null,
    fnError: Function = null,
    showLoading: Boolean = true
  ) {
    var httpOptions = this.getBXHttpOptions(params);
    if (showLoading) this.requestLoader(true);

    await this.http
      .get(this.baseBxUrl + url, httpOptions)
      .toPromise()
      .then(async (data) => {
        this.requestLoader(false);
        if (fnSuccess != null) await fnSuccess(data);
      })
      .catch((err) => {
        this.handleBxErrors(err);
        if (fnError != null) fnError(err);
      });
    // console.log(response);
  }

  postBX(
    url: string,
    params: Object = {},
    fnSuccess: Function = null,
    fnError: Function = null,
    showLoading: Boolean = true
  ) {
    if (this.getCookie("bxat").length == 0) return;

    var bxheaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
    });
    bxheaders.append("Access-Control-Allow-Origin", location.href);
    params["auth"] = this.getCookie("bxat");
    console.log(params);
    var httpOptions = {
      headers: bxheaders,
      // params:params
    };
    if (showLoading) this.requestLoader(true);

    this.http
      .post(this.baseBxUrl + url, JSON.stringify(params), httpOptions)
      .subscribe(
        (response) => {
          this.requestLoader(false);
          // console.log(response);
          if (fnSuccess != null) fnSuccess(response);
        },
        (err) => {
          this.handleBxErrors(err);
          if (fnError != null) fnError(err);
        }
      );
  }
  getHttpOptions(params: any = {}): Object {
    this.initHeaders();
    var httpOptions = {
      headers: this.headers,
      reportProgress: true,
      // responseType: 'application/json' as 'application/json',
      params: params,
    };
    return httpOptions;
  }
  get(
    url: string,
    params: any = null,
    fnSuccess: Function = null,
    fnError: Function = null,
    showLoading: boolean = true
  ) {
    // this.initHeaders();
    this.httpOptions = this.getHttpOptions();
    this.http.get(this.baseUrl + url, this.httpOptions).subscribe(
      (response) => {
        // console.log(response);
        if (fnSuccess != null) fnSuccess(response);
      },
      (err) => {
        console.log("Error: " + err);
        this.handleErrors(err);
        if (fnError != null) fnError(err);
      }
    );
  }
  authenticate(url, userCredentials: UserCredentials) {
    this.post(url, userCredentials, (res) => {
      // console.log(res);
      // var data = JSON.parse(res).rootElement;
      var token = res.DATA.access_token;
      try {
        var bxData = res.DATA.bx_data;
        this.setBXToken(bxData.access_token);
      } catch {}

      this.setToken(token);
    });
  }
  register(url, userRegistration: UserRegistration) {
    this.post(url, userRegistration, (res) => {
      // var data = JSON.parse(res).rootElement;
      var token = res.DATA.access_token;
      this.setToken(token);
    });
  }

  setToken(token: string) {
    var dt = new Date();
    dt.setDate(90);
    this.setCookieExpire("at", token, dt);
    location.reload();
  }
  setBXToken(token: string) {
    if (this.getCookie("bxat").length > 0) this.updateCookie("bxat", token);
    else this.setCookie("bxat", token);
    // location.reload();
  }

  requestLoader(show: boolean = true) {
    if (show) {
      if (
        !document
          .getElementsByClassName("request-modal-loader")[0]
          .classList.contains("show")
      )
        document
          .getElementsByClassName("request-modal-loader")[0]
          .classList.add("show");
    } else if (
      document
        .getElementsByClassName("request-modal-loader")[0]
        .classList.contains("show")
    )
      document
        .getElementsByClassName("request-modal-loader")[0]
        .classList.remove("show");
  }

  copyToClipboard(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
}
