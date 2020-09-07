import { attachedObject } from '../../tasks/models/task';
import { sign } from 'crypto';
import { url } from 'inspector';

export class recentChat {
    private _id:string = "";
    public get ID():string {
        return this._id;
    };
    public set ID(value:string) {
        this._id = value.toString()
    }
    public type:string ="";
    private _name:string = "";
    public get name():string {
        return this._name;
    };
    public set name(value:string) {
        this._name = value.replace(`Workgroup: "`,"").replace(`"`,"");
    }
    public color:string = "";
    
    public messages:message[];
    public lastMessage:message;
    public users:Object[];
    public files:file[];
    public reversedMessages:message[];
    public hasNewMessages:boolean = false;
    reverseMessages() {
        if (this.messages.length > 0)
        this.reversedMessages = this.messages.slice().reverse();
        else 
        this.reversedMessages = this.messages;
    }
}
export class message {
    public author_id:number;
    public chat_id:number;
    public date:Date;
    public id:number;
    public params:messageParams;
    public text:string;
    public unread:boolean;
}
export class messageParams {
    public CONNECTOR_MID:[];
    public FILE_ID:number[];
}
export class file extends attachedObject {
    public id:number;
    public name:string;
    public type:string;
    // public urlDownload = this.download_url;
    // public urlPreview:string;
    // public urlShow:string;
    constructor() {
        super();
        // super.download_url = this.urlDownload;
    }
}