import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Authuser } from 'src/app/common/authuser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { contextMenuItem, CardComponent } from 'src/app/components/card/card.component';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  storage:diskObject[];
  rootFolderID:number = 0;
  creatingNewFolder:Boolean = false;
  newFolderName:string = "";
  contextMenuItems:contextMenuItem[] = [];
  
  shareLink:string = null;
  @HostBinding('class.notAuthorized')
  notAuthorized:string = Authuser.bxToken.length > 0 ? "" : "notAuthorized";

  constructor(private commonService:CommonService, private httpClient:HttpClient, private route:ActivatedRoute, private router:Router) {
    this.addContextMenuItem("კოპირება","file_copy",(card) => {
      var objID = Number(card.getAttribute("objectID"));
      var obj = this.storage.find(x=>x.id == objID);
      if (obj != null) {
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 3);
        this.commonService.setCookieExpire("copyObjectID",obj.id,expireDate);
        this.commonService.setCookieExpire("copyObjectType",obj.type,expireDate);
        this.commonService.setCookieExpire("copyObjectAction","copy",expireDate);
        // alert("ფაილი დაკოპირდა");
      }

    });
    this.addContextMenuItem("გადატანა","file_copy",(card) => {
      var objID = Number(card.getAttribute("objectID"));
      var obj = this.storage.find(x=>x.id == objID);
      if (obj != null) {
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 3);
        this.commonService.setCookieExpire("copyObjectID",obj.id,expireDate);
        this.commonService.setCookieExpire("copyObjectType",obj.type,expireDate);
        this.commonService.setCookieExpire("copyObjectAction","move",expireDate);
        // alert("ფაილი დაკოპირდა");
      }

    });
    this.addContextMenuItem("ჩამოტვირთვა","get_app",(card)=> {
      var objID = Number(card.getAttribute("objectID")); // დაითრიე კონკრეტული რომელზეც ვაჭერი იმ ქარდის ობჯექტ აიდი
      var obj = this.storage.find(x=>x.id == objID); // იპოვე ობიექტი წამოღებულ ფოლდერ, ფაილებში
      if (obj != null) {
        this.downloadFile(obj.id);
      }
    }, (card) => {
      var objID = Number(card.getAttribute("objectID")); // დაითრიე კონკრეტული რომელზეც ვაჭერი იმ ქარდის ობჯექტ აიდი
      var obj = this.storage.find(x=>x.id == objID); // იპოვე ობიექტი წამოღებულ ფოლდერ, ფაილებში
      if (obj != null) {
        if (obj.type == "folder") return true; // disabled if folder
      }
      return false;
    })
    this.addContextMenuItem("სახელის გადარქმევა","create",(card:HTMLElement) => {
      var objID = Number(card.getAttribute("objectID"));
      var obj = this.storage.find(x=>x.id == objID);
      if (obj != null) obj.isRenaming = true;
    });
    this.addContextMenuItem("წაშლა","delete",(card:HTMLElement) => {
      var confirm = window.confirm("ნამდვილად გსურთ წაშლა?");
      if (!confirm) return;

      var objID = Number(card.getAttribute("objectID"));
      var obj = this.storage.find(x=>x.id == objID);
      if (obj != null) {
        var url = "";
        if (obj.type == "folder")
        url = "disk.folder.deletetree";
        else
        url = "disk.file.delete";

        this.commonService.getBX(url + "?id=" + objID, {}, ()=>location.reload(),() => location.reload());
      }
    });
    this.addContextMenuItem("ლინკის გაზიარება","share",(card:HTMLElement) => {
      var objID = Number(card.getAttribute("objectID"));
      var obj = this.storage.find(x=>x.id == objID);
      if (obj != null) {
      this.shareLink = obj.detail_url;
      this.linkIsCopied = false;
      }
    });

    this.route.params.subscribe(params => {
      if (params["id"] != null)
      this.openFolder(params["id"]);
    });
    if (this.route.snapshot.params["id"] == null && Authuser.bxToken.length > 0)
      this.getRootFolder();

  }
  addContextMenuItem(label:string,iconName:string,click:Function, disableFunction:Function = null) {
    var ctxItem = new contextMenuItem();
    ctxItem.label = label;
    ctxItem.iconName = iconName;
    ctxItem.click = click;
    if (disableFunction != null)
    ctxItem.disableFunction = disableFunction;

    this.contextMenuItems.push(ctxItem);
  }
  clickContextAction1() {
    alert("Bb");
  }

  ngOnInit(): void {
    if (Authuser.bxToken.length == 0 && this.commonService.getCookie("questionnaire") != "1") {
      setTimeout(() => {
        if (!location.href.includes("OrgDetails"))
        location.href = "/Chat";
      }, 7000);
    }
  }
  getRootFolder() {
    var filterBtWg ="?filter[ENTITY_ID]=" + (Authuser.workgroup.active ? Authuser.workgroup.ID : Authuser.bxUserID);
    var filterType = Authuser.workgroup.active ? "&filter[ENTITY_TYPE]=group" : "";
    var filter = filterBtWg + filterType;
    this.commonService.getBX("disk.storage.getlist" + filter, {}, (data) => {
      this.rootFolderID = data.result[0]["ROOT_OBJECT_ID"]; // base folder of this group's drive
      if (this.route.snapshot.params["id"] == null)
        this.openFolder(this.rootFolderID);
    })
  }

  clickObject(index:number) {
    var objectID = this.storage[index].id;
    if (this.storage[index]["type"] == "folder") {
      this.openFolder(objectID);
    }
    else if (this.storage[index]["download_url"] != null) 
      this.downloadFile(objectID);
  }
  openFolder(folderID:number) {
    var filter = "?id=" + folderID;
    this.commonService.getBX("disk.folder.getchildren" + filter, {}, (data) => {
      this.storage = [];
      data.result.forEach(element => {
         var x = new diskObject();
         x.id = element.ID;
         x.name = element.NAME;
         x.type = element.TYPE;
         x.download_url = element.DOWNLOAD_URL;
         x.detail_url = element.DETAIL_URL;
         this.storage.push(x);
      });
    });
    this.router.navigate(["Drive",folderID]);
  }
  downloadFile(fileID:number) {
    var url = this.storage.find(x=>x.id == fileID)["download_url"];
    location.href = url; 
  }

  uploadFile(fileName:string,fileContent:any, file:File) {
    var params = {
      id:this.route.snapshot.params["id"],
      // "data[NAME]": fileName,
      // fileContent: fileContent
    }
    this.commonService.getBX("disk.folder.uploadfile" ,params,(res) => {
      var uploadUrl = res.result.uploadUrl;
      var params = {file: fileContent};
      const fd = new FormData();
      fd.append("file",file);
      // formData.append("file", fileContent);

      this.commonService.requestLoader(true);
      this.httpClient.post<any>(uploadUrl,fd).subscribe(data => {
        location.reload();
      this.commonService.requestLoader(false);
      }, err => {
      this.commonService.requestLoader(false);
        console.log(err);
        window.alert(err.error.error_description);
      });
    })
  }

  fileSelect(file:any) {
    if (file.target.files && file.target.files[0]) {
      var reader = new FileReader();
      var $this = this;
      var fileName = file.target.files[0].name;
      reader.onload =  function (e:any) {
        $this.uploadFile(fileName,e.target.result, <File>file.target.files[0])
      };
      reader.readAsDataURL(file.target.files[0]);
    }
  }
  clickUpload() {
    document.getElementById("myFile").click();
  }
  newFolderClick() {
    this.creatingNewFolder = true;
  }
  createNewFolderClick() {
    this.creatingNewFolder = false;

    if (this.route.snapshot.params["id"] == null || this.newFolderName.trim().length == 0) return;
    
    var filter = "?id=" + this.route.snapshot.params["id"] + "&data[NAME]=" + this.newFolderName;
    this.commonService.getBX("disk.folder.addsubfolder" + filter,{},data=>location.reload());
  }

  renameConfirmClick(id:number, value:string, type:string = "file") {
    this.commonService.getBX("disk." + type + ".rename?id=" + id + "&newName=" + value, {}, () => location.reload(), () => location.reload());
  }
  clickMore(event:MouseEvent, card:CardComponent) {
    // console.log(card);
    card.onContextMenu(event,null);
  }
  isCopied(objectID:number) {
    return Number(this.commonService.getCookie("copyObjectID")) == objectID;
  }
  isAnythingCopied() {
    return Number(this.commonService.getCookie("copyObjectID")) > 0;
  }
  copyOrMoveToCurrentID() {
    var currentFolderID = Number(this.route.snapshot.params["id"]);
    if (currentFolderID > 0)
    {
      try {
        var copyObjID = Number(this.commonService.getCookie("copyObjectID"));
        var type = this.commonService.getCookie("copyObjectType");
        var action = this.commonService.getCookie("copyObjectAction");

        var typeStr = type == "folder" ? "folder" : type == "file" ? "file" : null;
        var actionStr = action == "copy" ? "copyto" : action == "move" ? "moveto" : null;

        this.commonService.removeCookie("copyObjectAction");

        if (typeStr == null) {
          this.clearCopyCookies();

          alert("შეცდომა კოპირებისას: 1");
          location.reload();
        }
        this.commonService.getBX("disk." + typeStr + "." + actionStr + "?id=" + copyObjID + "&targetFolderId=" + currentFolderID, {}, data => location.reload(), err => location.reload())
      }
      catch {
        alert("შეცდომა კოპირებისას, გთხოვთ ცადოთ თავიდან.")
      }
    }
    else
    alert("შეცდომა კოპირებისას.");

    this.clearCopyCookies();
  }
  clearCopyCookies() {
    this.commonService.removeCookie("copyObjectID");
    this.commonService.removeCookie("copyObjectType");
    this.commonService.removeCookie("copyObjectAction");
  }
  linkIsCopied:boolean = false;
  copyClipboard(val:string) {
    this.commonService.copyToClipboard(val);
    this.linkIsCopied = true;
  }
}

export class diskObject {
  public id:number;
  public name:string;
  public type:string;
  public download_url:string;
  public detail_url:string;
  public isRenaming:boolean = false;
}