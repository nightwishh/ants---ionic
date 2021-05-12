export class Task {
  private _editing: boolean = false;
  public get editing(): boolean {
    return this._editing;
  }
  public set editing(value: boolean) {
    if (value == true)
      if (Number(this.status) != 5)
        // თუ დასრულებული არაა შეგიძლია დაედიტება
        this._editing = value;
      else this._editing = false;
    else this.editing = false;
  }
  public get hasFiles(): boolean {
    if (
      this.ufTaskWebdavFiles &&
      this.ufTaskWebdavFiles.toString() != "false" &&
      this.ufTaskWebdavFiles.length > 0
    )
      return true;
    return false;
  }
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public descriptionInBbcode?: string,
    public declineReason?: any,
    public priority?: string,
    public status?: number,
    public notViewed?: string,
    public statusComplete?: string,
    public multitask?: string,
    public stageId?: string,
    public responsible?: any,
    public responsibleId: string = "",
    public responsibleName?: string,
    public responsibleLastName?: string,
    public responsibleSecondName?: any,
    public responsibleLogin?: string,
    public responsibleWorkPosition?: string,
    public responsiblePhoto?: string,
    public dateStart?: any,
    public durationFact?: any,
    public timeEstimate?: string,
    public timeSpentInLogs?: any,
    public replicate?: string,
    public deadline?: Date,
    public deadlineOrig?: string,
    public startDatePlan?: Date,
    public endDatePlan?: Date,
    public creator?: any,
    public createdBy?: string,
    public createdByName?: string,
    public createdByLastName?: string,
    public createdBySecondName?: any,
    public createdByLogin?: string,
    public createdByWorkPosition?: any,
    public createdByPhoto?: any,
    public createdDate?: Date,
    public changedBy?: string,
    public changedDate?: Date,
    public statusChangedBy?: string,
    public statusChangedDate?: Date,
    public closedBy?: any,
    public closedDate?: any,
    public guid?: string,
    public xmlId?: string,
    public mark?: any,
    public allowChangeDeadline?: string,
    public allowChangeDeadlineCount?: any,
    public allowChangeDeadlineCountValue?: any,
    public allowChangeDeadlineMaxtime?: any,
    public allowChangeDeadlineMaxtimeValue?: any,
    public allowTimeTracking?: string,
    public matchWorkTime?: string,
    public taskControl?: string,
    public addInReport?: string,
    public groupId?: string,
    public forumTopicId?: any,
    public parentId?: any,
    public commentsCount?: any,
    public forumId?: any,
    public siteId?: string,
    public subordinate?: string,
    public exchangeModified?: any,
    public exchangeId?: any,
    public outlookVersion?: string,
    public viewedDate?: Date,
    public deadlineCounted?: string,
    public forkedByTemplateId?: string,
    public favorite?: string,
    public sorting?: string,
    public durationPlanSeconds?: string,
    public durationTypeAll?: string,
    public durationPlan?: string,
    public durationType?: string,
    public subStatus?: string,
    public group?: any,
    public lastComment: Comment = new Comment(),
    public newComment: string = "",
    public ufTaskWebdavFiles: [] = [],
    public attachedFiles: attachedObject[] = []
  ) {}

  // creator?: Creator,
  // responsible?: Responsible,
  public static cast(a?: any, instance?: Task) {
    for (let key in a) {
      instance[key] = a[key];
      // if (instance[key] != null) instance[key] = a[key];
    }
    return instance;
  }
  public static statuses = [
    {
      name: "STATE_NEW",
      nameGeo: "ახალი",
      value: 1,
    },
    {
      name: "STATE_PENDING",
      nameGeo: "მოლოდინში",
      value: 2,
    },
    {
      name: "STATE_IN_PROGRESS",
      nameGeo: "მიმდინარე",
      value: 3,
    },
    {
      name: "STATE_SUPPOSEDLY_COMPLETED",
      nameGeo: "თითქმის დასრულებული",
      value: 4,
    },
    {
      name: "STATE_COMPLETED",
      nameGeo: "დასრულებული",
      value: 5,
    },
    {
      name: "STATE_DEFERRED",
      nameGeo: "შენელებული",
      value: 6,
    },
    {
      name: "STATE_DEFERRED",
      nameGeo: "უარყოფილი / შეჩერებული",
      value: 7,
    },
  ];
}
export class Comment {
  constructor(
    public author: string = "",
    public postmessage: string = "",
    public postdate: string = ""
  ) {}
}
export class attachedObject {
  public id: number;
  public object_id: number;
  public name: string;
  public download_url: string;
  public detail_url: string;
  public size: number;
  public get isImage(): boolean {
    if (
      this.name.endsWith(".jpg") ||
      this.name.endsWith(".jpeg") ||
      this.name.endsWith(".png")
    )
      return true;
    return false;
  }
}
