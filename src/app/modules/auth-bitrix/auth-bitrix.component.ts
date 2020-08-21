import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-auth-bitrix',
  templateUrl: './auth-bitrix.component.html',
  styleUrls: ['./auth-bitrix.component.css']
})
export class AuthBitrixComponent implements OnInit {

  constructor(private commonService:CommonService) { }
  accessToken:string = "";
  refreshToken:string = "";
  email:string = "";
  ngOnInit(): void {
    this.commonService.get("Users/AuthBitrixFromRedirect" + location.search, null, (data) => {
      // var x = JSON.parse(data);
      this.accessToken = data.rootElement.DATA.RootElement.access_token;
      this.refreshToken = data.rootElement.DATA.RootElement.refresh_token;
      var params = {};
      params["auth"] = this.accessToken;
      this.commonService.getBX("user.current",params,(user) => {
        this.email = user.result.EMAIL;

        var expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + 10);
        this.commonService.setCookieExpire("newBxAccessToken",this.accessToken,expireDate);
        this.commonService.setCookieExpire("newBxRefreshToken",this.refreshToken,expireDate);
        this.commonService.setCookieExpire("newBxEmail",this.email,expireDate);
        window.close();
      })
      
    })
  }

}
