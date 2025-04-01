// tipo de dato que yo quiero manejar con los usuarios
export interface User {
  _id:      string;
  username: string;
  name:     string;
  first_name: string;
  last_name: string;
  isActive: boolean;
  roles:    string[];
  description: string;
  roles_id: number;
  sales_organizations_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  created_user?: string | null;
  updated_user?: string | null;
  deleted_user?: string | null;
}

