import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { RolePermissions } from '../../../../interfaces/roles.interfaces';
import { RolesService } from '../../../../services/roles.service';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { model } from '@angular/core';


@Component({
    templateUrl: './add-permisos.component.html',
    styles: ``,
    standalone: false
})
export class AddPermisosComponent {
  readonly checked = model(false);

  public rolForm = new FormGroup({
    roles_id: new FormControl(0),
    list_roles: new FormControl(0),
    add_roles: new FormControl(0),
    modify_roles: new FormControl(0),
    delete_roles: new FormControl(0),
    list_users: new FormControl(0),
    add_users: new FormControl(0),
    modify_users: new FormControl(0),
    delete_users: new FormControl(0),
    list_unit_org: new FormControl(0),
    add_unit_org: new FormControl(0),
    modify_unit_org: new FormControl(0),
    delete_unit_org: new FormControl(0),
    list_sales_org: new FormControl(0),
    add_sales_org: new FormControl(0),
    modify_sales_org: new FormControl(0),
    delete_sales_org: new FormControl(0),
    list_devices: new FormControl(0),
    add_devices: new FormControl(0),
    modify_devices: new FormControl(0),
    delete_devices: new FormControl(0),
    list_accounts: new FormControl(0),
    add_accounts: new FormControl(0),
    modify_accounts: new FormControl(0),
    delete_accounts: new FormControl(0),
    list_prospects: new FormControl(0),
    add_prospects: new FormControl(0),
    modify_prospects: new FormControl(0),
    list_type_accounts: new FormControl(0),
    add_type_accounts: new FormControl(0),
    modify_type_accounts: new FormControl(0),
    delete_type_accounts: new FormControl(0),
    list_classifications_accounts: new FormControl(0),
    add_classifications_accounts: new FormControl(0),
    modify_classifications_accounts: new FormControl(0),
    delete_classifications_accounts: new FormControl(0),
    lista_contacts: new FormControl(0),
    add_contacts: new FormControl(0),
    modify_contacts: new FormControl(0),
    delete_contacts: new FormControl(0),
    list_warehouses: new FormControl(0),
    add_warehouses: new FormControl(0),
    modify_warehouses: new FormControl(0),
    delete_warehouses: new FormControl(0),
    list_routes: new FormControl(0),
    add_routes: new FormControl(0),
    modify_routes: new FormControl(0),
    delete_routes: new FormControl(0),
    list_trucks: new FormControl(0),
    add_trucks: new FormControl(0),
    modify_trucks: new FormControl(0),
    delete_trucks: new FormControl(0),
    list_payment_conditions: new FormControl(0),
    add_payment_conditions: new FormControl(0),
    modify_payment_conditions: new FormControl(0),
    delete_payment_conditions: new FormControl(0),
    list_competence_business: new FormControl(0),
    add_competence_business: new FormControl(0),
    modify_competence_business: new FormControl(0),
    delete_competence_business: new FormControl(0),
    list_competence_products: new FormControl(0),
    add_competence_products: new FormControl(0),
    modify_competence_products: new FormControl(0),
    delete_competence_products: new FormControl(0),
    list_order_type: new FormControl(0),
    add_order_type: new FormControl(0),
    modify_order_type: new FormControl(0),
    delete_order_type: new FormControl(0),
    list_group_promotions: new FormControl(0),
    add_group_promotions: new FormControl(0),
    modify_group_promotions: new FormControl(0),
    delete_group_promotions: new FormControl(0),
    list_promotions: new FormControl(0),
    add_promotions: new FormControl(0),
    modify_promotions: new FormControl(0),
    delete_promotions: new FormControl(0),
    list_orders: new FormControl(0),
    add_orders: new FormControl(0),
    modify_orders: new FormControl(0),
    delete_orders: new FormControl(0),
    list_orders_history: new FormControl(0),
    list_collections: new FormControl(0),
    add_collections: new FormControl(0),
    modify_collections: new FormControl(0),
    delete_collections: new FormControl(0),
    list_collections_pending: new FormControl(0),
    add_collections_pending: new FormControl(0),
    modify_collections_pending: new FormControl(0),
    delete_collections_pending: new FormControl(0),
    list_returns: new FormControl(0),
    add_returns: new FormControl(0),
    modify_returns: new FormControl(0),
    delete_returns: new FormControl(0),
    list_credit_note: new FormControl(0),
    add_credit_note: new FormControl(0),
    modify_credit_note: new FormControl(0),
    delete_credit_note: new FormControl(0),
    list_debit_note: new FormControl(0),
    add_debit_note: new FormControl(0),
    modify_debit_note: new FormControl(0),
    delete_debit_note: new FormControl(0),
    list_delivery_management: new FormControl(0),
    add_delivery_management: new FormControl(0),
    modify_delivery_management: new FormControl(0),
    delete_delivery_management: new FormControl(0),
    list_prices_captured: new FormControl(0),
    add_prices_captured: new FormControl(0),
    modify_prices_captured: new FormControl(0),
    delete_prices_captured: new FormControl(0),
    list_loads: new FormControl(0),
    add_loads: new FormControl(0),
    modify_loads: new FormControl(0),
    delete_loads: new FormControl(0),
    list_stocks: new FormControl(0),
    list_reloads: new FormControl(0),
    add_reloads: new FormControl(0),
    modify_reloads: new FormControl(0),
    delete_reloads: new FormControl(0)
  });

  get currentPermisos(): RolePermissions {
    const permiso = this.rolForm.value as RolePermissions;
    return permiso;
  }

  constructor(
    private rolService: RolesService,
    public dialogRef: MatDialogRef<AddPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolePermissions
  ) {}
  
   closeDialog(): void {
    this.dialogRef.close(); 
   }
  
   onCheckboxChange(key: string, event: MatCheckboxChange): void {
      this.rolForm.get(key)?.setValue(event.checked ? 1 : 0); // Asigna 1 si está marcado, 0 si no
   }
  
   onSubmit(): void {
      if (this.rolForm.invalid) return;
  
      this.rolService.addPermisos(this.currentPermisos).subscribe(
        (rol) => {
          console.log('Permisos agregados:', rol);
          
          Swal.fire({
            title: 'Éxito!',
            text: 'El Permiso ha sido agregado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.dialogRef.close(rol); // Cierra el diálogo y pasa los datos
        },
        (error) => {
          console.error('Error al agregar el permiso:', error);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo agregar el permiso. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
   }

}
