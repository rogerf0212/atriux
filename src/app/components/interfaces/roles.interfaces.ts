// export interface RolePermissions {
//   // id?: number;
//   roles_id: number;
//   list_roles?: number; // Permiso para listar roles
//   add_roles?: number; // Permiso para agregar roles
//   modify_roles?: number; // Permiso para modificar roles
//   delete_roles?: number; // Permiso para eliminar roles

//   list_users?: number; // Permiso para listar usuarios
//   add_users?: number; // Permiso para agregar usuarios
//   modify_users?: number; // Permiso para modificar usuarios
//   delete_users?: number; // Permiso para eliminar usuarios

//   list_unit_org?: number; // Permiso para listar unidades organizativas
//   add_unit_org?: number; // Permiso para agregar unidades organizativas
//   modify_unit_org?: number; // Permiso para modificar unidades organizativas
//   delete_unit_org?: number; // Permiso para eliminar unidades organizativas

//   list_sales_org?: number; // Permiso para listar organizaciones de ventas
//   add_sales_org?: number; // Permiso para agregar organizaciones de ventas
//   modify_sales_org?: number; // Permiso para modificar organizaciones de ventas
//   delete_sales_org?: number; // Permiso para eliminar organizaciones de ventas

//   list_devices?: number; // Permiso para listar dispositivos
//   add_devices?: number; // Permiso para agregar dispositivos
//   modify_devices?: number; // Permiso para modificar dispositivos
//   delete_devices?: number; // Permiso para eliminar dispositivos

//   list_accounts?: number; // Permiso para listar cuentas
//   add_accounts?: number; // Permiso para agregar cuentas
//   modify_accounts?: number; // Permiso para modificar cuentas
//   delete_accounts?: number; // Permiso para eliminar cuentas

//   list_prospects?: number; // Permiso para listar prospectos
//   add_prospects?: number; // Permiso para agregar prospectos
//   modify_prospects?: number; // Permiso para modificar prospectos

//   list_type_accounts: number;
//   add_type_accounts: number;
//   modify_type_accounts: number;
//   delete_type_accounts: number;
//   list_classifications_accounts: number;
//   add_classifications_accounts: number;
//   modify_classifications_accounts: number;
//   delete_classifications_accounts: number;
//   lista_contacts: number;
//   add_contacts: number;
//   modify_contacts: number;
//   delete_contacts: number;
//   list_warehouses: number;
//   add_warehouses: number;
//   modify_warehouses: number;
//   delete_warehouses: number;
//   list_routes: number;
//   add_routes: number;
//   modify_routes: number;
//   delete_routes: number;
//   list_trucks: number;
//   add_trucks: number;
//   modify_trucks: number;
//   delete_trucks: number;
//   list_payment_conditions: number;
//   add_payment_conditions: number;
//   modify_payment_conditions: number;
//   delete_payment_conditions: number;
//   list_competence_business: number;
//   add_competence_business: number;
//   modify_competence_business: number;
//   delete_competence_business: number;
//   list_competence_products: number;
//   add_competence_products: number;
//   modify_competence_products: number;
//   delete_competence_products: number;
//   list_order_type: number;
//   add_order_type: number;
//   modify_order_type: number;
//   delete_order_type: number;
//   list_group_promotions: number;
//   add_group_promotions: number;
//   modify_group_promotions: number;
//   delete_group_promotions: number;
//   list_promotions: number;
//   add_promotions: number;
//   modify_promotions: number;
//   delete_promotions: number;
//   list_orders: number;
//   add_orders: number;
//   modify_orders: number;
//   delete_orders: number;
//   list_orders_history: number;
//   list_collections: number;
//   add_collections: number;
//   modify_collections: number;
//   delete_collections: number;
//   list_collections_pending: number;
//   add_collections_pending: number;
//   modify_collections_pending: number;
//   delete_collections_pending: number;
//   list_returns: number;
//   add_returns: number;
//   modify_returns: number;
//   delete_returns: number;
//   list_credit_note: number;
//   add_credit_note: number;
//   modify_credit_note: number;
//   delete_credit_note: number;
//   list_debit_note: number;
//   add_debit_note: number;
//   modify_debit_note: number;
//   delete_debit_note: number;
//   list_delivery_management: number;
//   add_delivery_management: number;
//   modify_delivery_management: number;
//   delete_delivery_management: number;
//   list_prices_captured: number;
//   add_prices_captured: number;
//   modify_prices_captured: number;
//   delete_prices_captured: number;
//   list_loads: number;
//   add_loads: number;
//   modify_loads: number;
//   delete_loads: number;
//   list_stocks: number;
//   list_reloads: number;
//   add_reloads: number;
//   modify_reloads: number;
//   delete_reloads: number;
//   created_at?: string;
//   updated_at?: string;
//   deleted_at?: string | null;
//   created_user?: string | null;
//   updated_user?: string | null;
//   deleted_user?: string | null;

  
// }

export interface RolePermissions {
  id?: number;
  roles_id: number;
  [key: string]: number | undefined; // Permite acceso dinámico a las propiedades
}



export interface RolePermissionModule {
  id: number;
  Rol: number; // Este campo puede ser el ID del rol
  name: string; // Nombre del módulo
  permisos: {
      list: number;
      add: number;
      modify: number;
      delete: number;
  }[];
}


export interface Role {
  id?: number;
  code?: string;
  description: string;
  sales_Organizations_id?: number;
  created_at?: string; // Puedes usar Date si prefieres manejarlo como objeto de fecha
  updated_at?: string; // Lo mismo aquí
  deleted_at?: string | null; // Puede ser null
  created_user?: string | null; // Puede ser null
  updated_user?: string | null; // Puede ser null
  deleted_user?: string | null; // Puede ser null
}

export interface NewRole {
  id?:   number;
  code?: string;
  description: string;
}