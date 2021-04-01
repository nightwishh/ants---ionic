export interface ICommonTask {
  id: number;
  name: number;
  taskCategoryId: number;
}
export class CommonTask implements ICommonTask {
  public id: number;
  public name: number;
  public taskCategoryId: number;
  public activeStartMonth: number = 1;
  public activeEndMonth: number = 12;
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
