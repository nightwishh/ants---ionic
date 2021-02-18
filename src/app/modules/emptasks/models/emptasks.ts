export interface CommonTask {
  id: number;
  name: number;
  taskCategoryId: number;
}
export interface TaskCategory {}
export interface Task {
  id: number;
  clientCompanyId: number;
  status: number;
  statusName: number;
  activeStartYear: number;
  activeStartMonth: number;
  activeEndYear: number;
  activeEndMonth: number;
  name: number;
  taskCategoryId: number;
  companyName: string;
  companyTin: string;
}
export interface ClientCompany {
  id: number;
  tin: string;
  name: number;
}
export interface Status {
  id: number;
  name: string;
}
