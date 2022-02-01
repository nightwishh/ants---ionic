import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class XWaybillService {
  constructor(private http: HttpClient) {}
  username: string = "testserv:206322102";
  password: string = "123456";
  params: string = "";
  public get mainXml(): string {
    return (
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' +
      this.params +
      "</soap:Body></soap:Envelope>"
    );
  }
  Authenticate() {}
  GetWaybills() {
    this.params = `<get_waybills xmlns="http://tempuri.org/">
    <su>testserv:206322102</su>
    <sp>123456</sp>
    <itypes>2</itypes>
    <buyer_tin>12345678910</buyer_tin>
  </get_waybills>`;
    var header = new HttpHeaders({
      "Content-Type": "text/xml; charset=utf-8",
    });
    header.append("SOAPAction", '"http://tempuri.org/get_waybills"');
    header.append("Content-Length", "");

    return this.http.post(
      "http://services.rs.ge/WayBillService/WayBillService.asmx?op=get_waybills",
      this.mainXml,
      { headers: header }
    );
  }
}
