import { Component, OnInit, ViewChildren, ElementRef, ViewChild, HostListener, ChangeDetectorRef, ChangeDetectionStrategy, NgZone, AfterViewInit } from '@angular/core';
import { Authuser } from 'src/app/common/authuser';
import { CommonService } from 'src/app/common/common.service';
import { ActivatedRoute, Scroll } from '@angular/router';
import { CommonFunctions } from 'src/app/common/common-functions';
import { recentChat, message, file } from './models/chat.model';
import { registerLocaleData } from '@angular/common';
import { TimeInterval } from 'rxjs';
import { attachedObject } from '../tasks/models/task';
import { InputComponent } from 'src/app/components/input/input.component';
import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';
import { async } from '@angular/core/testing';
import { reverse } from 'dns';
import { ReversePipe } from 'src/app/pipes/reverse.pipe';
import { Key } from 'readline';
import { BxCountersService } from 'src/app/services/bx-counters.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  authUser = Authuser;
  searchChatText:string = "";
  recentChats:Object[] = [];
  recentExternalChats:Object[];
  searchChats:Object[];
  searchUsers:Object[];

  currentDateStr: string = "";
  currentChatDates:Array<any> = new Array();
  previousChatDateStr:string = "";

  public get chatOpen():Boolean {
    return this.openedChat.ID.length > 0
  }
  openedChat:recentChat = new recentChat();
  prevOpenedChat:recentChat = new recentChat();
  newMessageText:string;

  showLoader:boolean = false;

  constructor(private commonService:CommonService,private bxNotifService:BxCountersService, private elementRef: ElementRef, private cdRef:ChangeDetectorRef, private zone:NgZone) { 
    
  }
  
  // @HostListener('messages:scroll', ['$event']) // for window scroll events
  alreadyScrolledToTop:boolean = false;
  chatScrollEvent:boolean = false;
  onChatScroll(event:Event) {
    // load more messages when scroll to top
    var elem = (event.target as HTMLElement)
    if (elem.scrollTop < this.scrollPartByPercentage(elem,20)) {
      if (!this.alreadyScrolledToTop) {
        var length = this.openedChat.messages.length;
        if (length > 0) {
          this.loadOlderMessages();
          this.alreadyScrolledToTop = true;       
        }
      }
    }
    else this.alreadyScrolledToTop = false;
  }  
  scrollPartByPercentage(elem:HTMLElement, percentage:number) {
    if (percentage > 100) percentage = 100;
    return (elem.scrollHeight - elem.offsetHeight) * percentage / 100;
  }
  @ViewChild("messages",{static:false}) private messagesView:ElementRef;
  recentChatsInterval:any;
  ngOnInit(): void {
    this.getRecentChats();
    this.setIntervals();
    // if (this.route.snapshot.params["id"] && !this.chatOpen) {
    //   this.openChatByID(this.route.snapshot.params["id"],this.openedChat.type);
    // }
  }
  lastNotifCount:number = 0;
  async setIntervals() {
    this.recentChatsInterval = setInterval(async () => {
      // if (this.bxNotifService.notifications.TYPE.DIALOG > this.lastNotifCount)
      // {
      //   this.lastNotifCount = this.bxNotifService.notifications.TYPE.DIALOG;
      // }
      this.openedChat.hasNewMessages = false;
      for (var i in this.bxNotifService.notifications.DIALOG) {
        if (this.openedChat.ID == i) { // if opened chat has notifications reload messages
          this.openedChat.hasNewMessages = true;
          break;
        }
      }

      await this.getRecentChats();

      if (this.chatOpen && this.openedChat.hasNewMessages)
      this.refreshChatMessages();
    }, 4500);
  }
  ngOnDestroy() {
    clearInterval(this.recentChatsInterval);
    this.elementRef.nativeElement.remove();
  }

  ngModelChange(text) {
    this.searchChats = null;
    new CommonFunctions().timeoutAfterKeyPress(700,()=> {
      this.searchChatsFunc(text);
    });
    
  }

  getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
  }


  searchChatsFunc(text) {
    var params = {
      FIND:text
    }
    this.commonService.getBX("im.search.chat.list",params,(data) => {
      this.searchChats = [];
      this.searchChats = data.result;
    },null,false)
    
    this.commonService.getBX("im.search.user.list",params,(data) => {
      this.searchUsers = [];      
      var dt:Object[] = data.result as Array<object>;
      var iterator = Object.keys(dt);
      for (const key of iterator){
        this.searchUsers.push(dt[key]);
      }
    },null,false)
  }

  async getRecentChats() {
   if (location.pathname == "/Chat") {
    await this.commonService.getBXAsync("im.recent.get",{},async (data) => {
      var internalChats = (data.result as Object[]).filter(x=>x["lines"] == null); // get only internal chats 
      this.recentChats = [];
      internalChats.forEach(element => {
        var obj = this.recentChats.find(x=>x["id"] == element["id"]) || null;
        // if (element["id"] == this.openedChat.ID && this.openedChat.hasNewMessages) this.refreshChatMessages(true);
        if (obj == null) // do not add duplicates
          this.recentChats.push(element);
      });
      this.recentExternalChats = (data.result as Object[]).filter(x=>x["lines"] != null); // get only external chats
      // this.searchChats = this.recentChats;
    },null,false);
   }
  }

 showRecentChats() {
  return !(this.searchChatText.length > 0)
 }
 index:number = 0;
 differentDateString(date:string) {
  this.index++;
  this.currentDateStr = new Date(date).toLocaleDateString();

  // if (this.currentChatDates.find(x=>x == this.currentDateStr)) 
    // return false;
  // else {
    // this.currentChatDates.push(this.currentDateStr);
    return true;    
  // }

  // if (this.index == 1) return true

  // if (this.previousChatDateStr == this.currentDateStr) // თუ წინა და მიმდინარე ერთია არ უნდა თარიღის მიწერა
  //    return false;
  // else {
  //   this.previousChatDateStr = this.currentDateStr;
  //   return true;
  // }
 }

 toDateOrTime(dateStr) {
   var today = new Date().getDate();
   var dt = new Date(dateStr);
   if (today == dt.getDate()) // თუ დღეს ვმესიჯობ მხოლოდ დრო გამოიტანოს
     return dt.getHours() + ":" + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
   else
     return dt.toLocaleString();
 }

 async refreshChatMessages(force:boolean = false) {
   var msgsView = this.messagesView.nativeElement as HTMLElement;
  if (this.chatOpen) {
    this.scrollMessagesToBottom();
    this.openedChat.hasNewMessages = false;
    await this.openChatByID(this.openedChat.ID,this.openedChat.type,false);
  }
 }
 showLoadOlderMessages:boolean = true;
 loadOlderMessages() {
   if (!this.chatOpen) return;
    var msgsLength = this.openedChat.messages.length;
   if (msgsLength > 0)
   var lastMessageID = this.openedChat.messages[msgsLength - 1].id
   //lastMessageID = this.openedChat
   
   var params = "?dialog_id=" + this.openedChat.ID + "&LAST_ID=" + lastMessageID;
   this.showLoader = true;
   return this.commonService.getBX("im.dialog.messages.get" + params,{},(data) => { 
    this.showLoader = false;
    var oldMessages:[{}] = data.result.messages;
    var files:[{}] = data.result.files;
    if (data.result.messages != null && data.result.messages.length == 0) {
      this.showLoadOlderMessages = false;
      return;
    }

    files.forEach(element => {
      var fl = new file();
      fl.id = element["id"];
      fl.name = element["name"];
      // fl.urlDownload = "";
      fl.size = element["size"];
      fl.type = element["type"];
      this.openedChat.files.push(fl);
    });
    oldMessages.forEach(element => {
      var msg = new message();
      msg.id = element["id"];
      msg.chat_id = element["chat_id"];
      msg.date = element["date"];
      msg.author_id = element["author_id"];
      msg.params = element["params"];
      msg.text = element["text"];
      msg.unread = element["unread"];
      this.openedChat.messages.push(msg);
      this.openedChat.reverseMessages();
    });
    this.alreadyScrolledToTop = false;
    this.cdRef.detectChanges();

  },()=>{this.showLoader = false},false);
 }
 fillOpenedChat() {

 }

 backToChatList() {
   this.openedChat = new recentChat();
 }
 
 async openChatByIDAsync(chatID:string,chatType:string) {
     await this.openChatByID(chatID, chatType);
  var x = 0;
 }

 async openChat(chat:Object, chatType:string = null) {
   chatType = chatType == null ? chat["type"] : chatType;
   var chatID = this.getChatID(chat["id"],chatType); 
   await this.openChatByID(chatID, chatType);

   this.openedChat.ID = chatID;
   this.openedChat.type = chatType;
   if (chatType == "user") {
    this.openedChat.fullName = chat["title"] || chat["name"];
    this.openedChat.name = chat["title"] || chat["name"];
    this.openedChat.color = chat["color"] || chat["avatar"]["color"];
   }
   else {
    this.openedChat.fullName = chat["name"] || chat["chat"]["name"];
    this.openedChat.name = chat["name"] || chat["chat"]["name"];
    this.openedChat.color = chat["color"] || chat["avatar"]["color"];
   }

   if (!this.chatScrollEvent) {
    setTimeout(() => {
      this.chatScrollEvent = true;
      this.zone.runOutsideAngular(() => {
        var msgsView = this.messagesView.nativeElement as HTMLElement;
        msgsView.addEventListener('scroll', (e)=> {
          this.onChatScroll(e);
        });
      });
      }, 100); 
   }
 }
@ViewChild("messageView",{static:false}) messageView:InputComponent;
 msgScrollToBottomTimer = null;
 async openChatByID(chatID:string, chatType:string, loader:boolean = true) {
   if (loader)
      this.showLoader = true;

  //  if (this.route.snapshot.params["id"] == null) return;

   var params = "?dialog_id=" + chatID;
   this.commonService.getBXAsync("im.dialog.messages.get" + params,{},async (data) => {
     this.showLoader = false;
     this.showLoadOlderMessages = true;
     this.prevOpenedChat = Object.assign([{}],this.prevOpenedChat,this.openedChat);
     this.openedChat.messages = data.result.messages;
     this.openedChat.reverseMessages();
     this.openedChat.users = data.result.users;
    
     if (chatType == "user") {
     this.openedChat.ID = chatID;
     this.openedChat.type = chatType;
     this.openedChat.name = this.getPersonName(Number(chatID)); // in this case chatID is AuthorID
     this.openedChat.color = this.getAvatar(Number(chatID));
     }

     this.openedChat.files = data.result.files;
     this.openedChat.hasNewMessages = false;
     if (this.openedChat.messages.length > 0 && this.openedChat.messages[0].unread) {
      var readMsgParams = "?dialog_id=" + chatID + "&message_id=" + this.openedChat.messages[0]["id"] // last message ID to read
      this.commonService.getBX("im.dialog.read" + readMsgParams,{},null,null,false);
      this.getRecentChats();
     }          

     if (loader) { // if loader is true that means we are opening new chat, if loader is false means we're refreshing msgs
      this.scrollMessagesToBottom();
     }
   },() => {
     this.showLoader = false;
   },false);
 }
 scrollMessagesToBottom() {
  this.msgScrollToBottomTimer = setTimeout(() => {
    if (this.messagesView.nativeElement) { 
      var msgView = this.messagesView.nativeElement as HTMLElement;
      msgView.scrollTop = msgView.scrollHeight;
      }
   }, 200);
 }
 getMessageFilePreviews(message:message) {
  var file:file[] = [];
  if (message?.params?.FILE_ID) {
    var fileIDs:number[] = message.params.FILE_ID;
    fileIDs.forEach(element => {
      file.push(this.openedChat.files.find(x=>x.id == element));
    });
    // console.log(file);
    // if (f != null) file.push(f);

   }

   return file;
 }

 openChatByUserID() {

 }

 keypress(event) {
   if (event.code == "Enter") this.sendMessage();
 }
 getSetLastMessage(chatID:string, messageID:number,messageText:string) {
   if (this.openedChat.ID == chatID) {
    this.openedChat.lastMessage = new message();
    this.openedChat.lastMessage.id = messageID;
    this.openedChat.lastMessage.text = messageText;
   }
  return messageText;
 }
sendMessage() {
  //  console.log(this.newMessageText);
  //  console.log(this.openedChat["ID"]);
   var chatID = Number(this.openedChat.ID.replace("chat",""));

   var chatIDParam = this.openedChat.type == "chat" ? "?chat_id=" + chatID : this.openedChat.type == "user" ? "?user_id=" + chatID : null;

   if (chatIDParam == null) console.error("Chat Type is not Group neither User");

   var params = chatIDParam + "&message=" + this.newMessageText;
   
   var bodyParams = {};
   bodyParams["message"] = this.newMessageText;

   var msg = new message();
   msg.text = this.newMessageText;
   msg.id = -1;
   msg.author_id = this.authUser.bxUserID;
   this.openedChat.messages.unshift(msg);
   this.openedChat.reverseMessages();
   this.scrollMessagesToBottom();
   this.newMessageText = "";
   
   this.commonService.getBX("im.message.add" + params,bodyParams,async () => {
     msg.id = 0;
     msg.date = new Date();
      // await this.refreshChatMessages(true);
      // this.scrollMessagesToBottom();
   },null,false)
 }

 isChatSelected(chatID:any) {
  return chatID == this.openedChat.ID;
 }
 getAvatar(authorID:number) {
   var usr = this.openedChat.users.find(x=>x["id"] == authorID);
   var usrPrevChat = null;
   if (this.prevOpenedChat.users != null && this.prevOpenedChat.users.length > 0)
    usrPrevChat = this.prevOpenedChat.users.find(x=>x["id"] == authorID);
 
   if (authorID != 0)
   var usrFromRecent = this.recentChats.find(x=>x["id"]==this.openedChat.ID);
   if (usr != null && usr["color"] != null)
    return usr["color"];
  else if (usrFromRecent != null && usrFromRecent["avatar"]["color"] != null)
    return usrFromRecent["avatar"]["color"];
  else if (usrPrevChat != null && usrPrevChat["color"] != null)
  return usrPrevChat["color"];
  else
    return "";
 }
 getPersonName(authorID:number) {
  var usr = this.openedChat.users.find(x=>x["id"] == authorID);
  var usrPrevChat = null;
  if (this.prevOpenedChat.users != null && this.prevOpenedChat.users.length > 0)
   usrPrevChat = this.prevOpenedChat.users.find(x=>x["id"] == authorID);

  if (authorID != 0)
  var usrFromRecent = this.recentChats.find(x=>x["id"]==this.openedChat.ID);
  if (usr != null && usr["first_name"] != null)
   return usr["first_name"];
  else if (usrFromRecent != null && usrFromRecent["title"] != null)
  return usrFromRecent["title"]
  else if (usrPrevChat != null && usrPrevChat["first_name"] != null)
  return usrPrevChat["first_name"];
  else
   return "";
 }

 getChatID(chatID:string, type:string) {
   var id = chatID.toString().replace("chat","");
   if (type == "chat") return "chat" + id;
   
   return id;
 }
 minimizeChatName(value:string) {
  return value.replace(`Workgroup: "`,"").replace(`"`,"");
 }
}
