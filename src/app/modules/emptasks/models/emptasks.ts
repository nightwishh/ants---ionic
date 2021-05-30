export interface ICommonTask {
  id: number;
  name: string;
  taskCategoryId: number;
}
export class CommonTask implements ICommonTask {
  public id: number;
  public name: string;
  public taskCategoryId: number;
  public activeStartMonth: number = 1;
  public activeEndMonth: number = 12;
  public deadlineDay: number = 0;
}

export interface ITaskCategory {}
export interface ITask {
  id: number;
  clientCompanyId: number;
  status: number;
  statusName: number;
  activeStartYear: number;
  activeStartMonth: number;
  activeEndYear: number;
  activeEndMonth: number;
  name: string;
  taskCategoryId: number;
  companyName: string;
  companyTin: string;
  deadlineDay: number;
}
export interface IClientCompany {
  id: number;
  tin: string;
  name: string;
}
export interface IStatus {
  id: number;
  name: string;
}
export interface IUserRole extends IStatus {}
export class UserRoleWithCategories {
  public roleId: number;
  public taskCategoryIds: Array<number> = [];
}

export class ClientCompany implements IClientCompany {
  id: number;
  tin: string;
  name: string;
}
export class RoleInCompany {
  public Id: number;
  public Name: string;
  public RoleId: number;
  public RoleName: string;
  public userId: number;
  public userFullName: string;
}
export class vEmployeeTeam {
  public UserId: number;
  public RoleId: number;
  public CompanyId: number;
  public CompanyTin: number;
  public CompanyName: number;
  public fullname: string;
}
