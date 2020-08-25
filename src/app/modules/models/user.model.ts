export class UserCredentials {
 public email:string;
 public password:string;
 constructor() {

 }
}
export class UserRegistration extends UserCredentials {
  public fullName:string;
  public phone:string = "";
  public confirmPassword:string;
}
export class UserProfile extends UserRegistration {
  public tin:string;
}
export class UserPasswords {
  public oldPassword:string;
  public newPassword:string;
  public confirmNewPassword:string;
}