import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'p-textedit',
  templateUrl: './textedit.component.html',
  styleUrls: ['./textedit.component.css']
})
export class TexteditComponent implements OnInit {

  constructor() { }
  ngModelRich:string = "";

  private _ngModel:string;
  get ngModel(): string {
    return this._ngModel;
  };
  @Input("ngModel") 
  set ngModel(val:string) {
    if (typeof val == "undefined") return;
    this._ngModel = val;
    this.ngModelRich = this.convertToRichText(val);
  };
  linkDetectionRegExp:RegExp = new RegExp(/(?:(?:https?|ftp):\/\/.*)/gm);
  editing:boolean = false;
  editings:string = "contenteditable";
  ngOnInit(): void {
  }
  contentChanging:string = "";
  onContentChange(val) {
    this.contentChanging = val;
    console.log(this.ngModelRich);
  }
  convertToRichText(text: string) {
    var returnStr = text;
    var regex = new RegExp(/\[URL=(.*?)\]/gm);
    var match;
    while ((match = regex.exec(text)) != null) {

    //if (match == null || match.length == 0) return returnStr;

    var href = match[1];
    var linkName = returnStr.split(match[0])[1].split("[/URL]")[0];
    var linkNameShow = linkName;
    if (linkName.length > 30 || this.detectLink(linkName))
    linkNameShow = "ლინკი";
    
    returnStr = returnStr.replace(match[0] + linkName + "[/URL]", this.createLink(linkNameShow,href));
    }
    returnStr = this.detectAndConvertToLink(returnStr);
    return returnStr;
  }
  detectLink(text:string) {
    var regex = this.linkDetectionRegExp;
    return regex.exec(text) != null;
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
  isFocused =false;
  onFocus() {
    this.isFocused = true;
    this.editing = true;
  }
  onFocusOut() {
    this.isFocused = false;
    this.editing = false;
    this.ngModelRich = this.contentChanging;
    // this.convertToRichTextNew(this.ngModel);
  }
}
