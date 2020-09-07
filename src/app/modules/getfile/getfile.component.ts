import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { partitionArray } from '@angular/compiler/src/util';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-getfile',
  templateUrl: './getfile.component.html',
  styleUrls: ['./getfile.component.css']
})
export class GetfileComponent implements OnInit {

  constructor(private route:ActivatedRoute,private commonService:CommonService) { }
  txt:string = "მიმდინარეობს ფაილის ჩამოტვირთვა...";
  ngOnInit(): void {
    var id = this.route.snapshot.params["id"];
    if (id > 0) {
      this.commonService.getBX("disk.file.get?id=" + id,{},data => {
        location.href = data["result"]["DOWNLOAD_URL"];
        this.txt = "ფაილი წარმატებით ჩამოიტვირთა შეგიძლიათ დახუროთ გვერდი";
      },() => {
        this.ngOnInit(); // retry on error
      })
      // location.href = "http://abcd.ge/" + id; 
    }
  }

}
