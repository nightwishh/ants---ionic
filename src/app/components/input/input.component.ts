import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { StringDecoder } from 'string_decoder';
import { HeaderRowOutlet } from '@angular/cdk/table';
import { CommonService } from 'src/app/common/common.service';
import { file } from 'src/app/modules/chat/models/chat.model';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
  selector: 'p-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  // basically this component is not meant for every project, it is very organised for bitrix
  constructor(private commonService:CommonService) { }

  @Input() setStyle: string;
  @Input() setClass: string;
  @Input() placeholder: string = "";
  @Input() type: string = "text";
  @Input() mIcon: string = "";
  @Input() ngModel: any = "";
  @Input() richTextFunction:Function = null;
  @Input() disabled: boolean = false;
  @Output() onEnterKey: EventEmitter<any> = new EventEmitter<any>();

  @Input() inlineText:boolean = false;

  @Input() filesPreview:file[] = [];
  @Input() id:number;
  isFocused: boolean = false;

  linkDetectionRegExp:RegExp = new RegExp(/(?:(?:https?|ftp):\/\/.*)/gm);
  ngModelRichText:Array<RichText> = new Array<RichText>();
  // @Input() ngModel:any = "";
  // @Output() ngModelChange:EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    // setInterval(() => {
    //   if (this.type == "textarea" && !this.isEditing())
    //   this.convertToRichTextNew(this.ngModel);
    // },500);
  }
  onFocus() {
    this.isFocused = true;
  }
  onFocusOut() {
    this.isFocused = false;
    // this.convertToRichTextNew(this.ngModel);
  }
  onKeyPress(event) {
    if (event.code == "Enter")
      this.onEnterKey.emit();
  }
  convertToRichTextNew(text:string) {
    var returnStr = text;
    var regex = new RegExp(RichTextPatterns.BitrixLink);
    var match;
    this.ngModelRichText = [];

    while ((match = regex.exec(text)) != null) {
      var richText = new RichText();
      var linkName = returnStr.split(match[0])[1].split("[/URL]")[0];

      if (linkName.length > 30 || this.detectLink(linkName))
      richText.text = "ლინკი";

      richText.type = RichTextTypes.BitrixLink;
      richText.href = match[1];

      this.ngModelRichText.push(richText);
    }
    console.log(this.ngModelRichText);
  }
  convertTextToFilePreview() {
    var previewsHtml:string[] = [];
    if (this.filesPreview.length > 0) {
      this.filesPreview.forEach(file => {
        var fileUrl = "/GetFile/" + file.id;
        // if (file.type == "image")
        //  previewsHtml.push("<img class='imgPreview' src='" + fileUrl + "' width='300px' />");
        // else 
         previewsHtml.push("<a href='" + fileUrl + "' target='_blank'>"+ file.name + "</a>");
      })
    }
    return previewsHtml;
  }
  convertToRichText(text: string) {
    var filePreviews = this.convertTextToFilePreview();
    if (text != null && text.length == 0 && filePreviews.length > 0) return filePreviews;

    var returnStr = text;
    var regex = new RegExp(/\[URL=(.*?)\]/gm);
    var match;
    while ((match = regex.exec(text)) != null) {

    //if (match == null || match.length == 0) return returnStr;

    var href = match[1] as string;
    if (href[0] == "/" && href[1] != "/") { // if starts with / slash, and not double slash, means it is an bitrix inner Link
      href = this.commonService.baseBxWebUrl + href;
    }
    var linkName = returnStr.split(match[0])[1].split("[/URL]")[0];
    var linkNameShow = linkName;
    if (linkName.length > 30 || this.detectLink(linkName))
    linkNameShow = "ლინკი";
    
    returnStr = returnStr.replace(match[0] + linkName + "[/URL]", this.createLink(linkNameShow,href));
    }
    returnStr = this.detectAndConvertToLink(returnStr);
    try {
      if (this.richTextFunction != null) {
        var returnVal = this.richTextFunction(returnStr);
        if (returnVal != null)
           returnStr = returnVal;
      }  
    }
    catch {
      
    }
    return returnStr;
  }

  detectLink(text:string) {
    var regex = this.linkDetectionRegExp;
    return regex.exec(text) != null;
  }
  replaceAt(string, index, replaceLength, replaceWith) {
    return string.substring(0, index) + replaceWith + string.substring(index + replaceLength);
  }
  detectAndConvertToLink(text:string) {
    var regex = this.linkDetectionRegExp;
    var returnStr:string = text;
    var alreadyLink:boolean = false;
    var match:RegExpExecArray;
    var i:number = 0;
    while ((match = regex.exec(text)) != null) {
      i++;
      var prevChars = returnStr.substring(match.index - 6, match.index);
      var nextChars = returnStr.substring(match.index + match[0].length, match.index + 6);
      if (prevChars.includes("href=") || (prevChars.substring(0,1) == "<" && nextChars.substring(0.1) == ">")) { // it is already a link
        continue;
      }
      // returnStr = returnStr.replace(/\n/g," ");
      // var splitStrLeft = returnStr.substring(match.index,match[0].length).replace(match[0])
      // returnStr = this.replaceAt(returnStr,match.index,match[0].length,this.createLink(match[0],match[0]));
      
      returnStr = returnStr.replace(match[0],this.createLink(match[0],match[0]))
    }
    return returnStr;
  }
  createLink(text:string,href:string,index:string = "") {
    href = href.replace("http://","//").replace("https://","//");
    text = text.replace("http://","").replace("https://","");
    
    return "<a href='" + href + "' target='_blank'>" + text + "</a>";
  }
  startEditing() {
    if (!this.disabled) {
      this.isFocused = true;
      setTimeout(() => {
        (document.getElementsByClassName("txtArea").item(0) as HTMLElement).focus();
      }, 200);
    }

  }
  
  isEditing() {
    if (!this.disabled && this.strNullOrEmpty(this.ngModel)) return true;
    if (!this.disabled && this.isFocused) return true;
    return false;
  }

  strNullOrEmpty(str:string) {
    return str == null || typeof str == 'undefined' || str.length == 0;
  }
  // ngModelChangeEvent() {
  // this.ngModelChange.emit();
  // }


}
export class RichText {
  public text:string;
  public type:RichTextTypes;
  public href:string;
  public static richTextPatterns = []
}
export enum RichTextTypes {
  JustText = 0,
  Link = 1,
  BitrixLink = 2
}
export class RichTextPatterns {
  public static Link = /(?:(?:https?|ftp):\/\/.*)/gm;
  public static BitrixLink = /\[URL=(.*?)\]/gm;
}