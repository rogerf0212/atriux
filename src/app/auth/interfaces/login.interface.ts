import { User } from "./user.interface";


export interface LoginResponse {
    resultado: number;
    data_user: User[];
    permissions: any[];
    // Username: User;
    // Password: string;
    // isActive: boolean;
  }