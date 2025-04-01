export interface unitOrganizations {
    id?:               string;
    Code:             string;
    Description:      string;
    created_at:       string;
    updated_at?:       string;
    deleted_at?:       string;
    created_user?:     string;
    updated_user?:     string;
    deleted_user?:     string;
    // imagen alternativa
    alt_img?:         string;
  }

  export interface unitSales {
    id?: string; // Asegúrate de que id sea opcional
    Code: string;
    Description: string;
    Unit_Organization_id: number; // Asegúrate de incluir este campo
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    created_user?: string;
    updated_user?: string;
    deleted_user?: string;
  }

  