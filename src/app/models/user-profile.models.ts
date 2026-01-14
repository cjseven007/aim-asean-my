export interface UserProfile {
  uid: string;
  // Company Details
  eligible:boolean;
  companyName:string;
  state:string;
  branch: string;
  sector:string;
  womanOperated: boolean;
  sizeOfOperation:string;
  // Personal Details
  fullName: string;
  email:string;
  phoneNumber:string;
  jobTitle:string;
  // Completion Status
  status:string;
}