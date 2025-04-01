import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { NewRole } from '../../../../interfaces/roles.interfaces';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: './add-rol-dialog.component.html',
    styles: ``,
    standalone: false
})
export class AddRolDialogComponent implements OnInit {

  public rolForm = new FormGroup({
    Description: new FormControl<string>('', { nonNullable: true }),
  });

  get currentRol(): NewRole {
    return {
      description: this.rolForm.value.Description || '',
    };
  }

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddRolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewRole
  ) {}

  closeDialog() {
    this.dialogRef.close(); 
  }

  onSubmit() {
    if (this.rolForm.invalid) return;

    const newRole = this.currentRol;

    // Llamada para agregar el rol y obtener el ID del rol creado
    this.http.post('http://137.184.57.180:3000/api/roles/insert', newRole).subscribe(
      (response: any) => {
        const newRoleId = response.id; // Obtener el ID del rol creado

        // Preparar el objeto de permisos con el ID del nuevo rol
        const permisosToSend = {
          roles_id: newRoleId,
          list_roles: 1,
          add_roles: 1,
          modify_roles: 1,
          delete_roles: 1,
          list_users: 1,
          add_users: 1,
          modify_users: 1,
          delete_users: 1,
          list_unit_org: 1,
          add_unit_org: 1,
          modify_unit_org: 1,
          delete_unit_org: 1,
          list_sales_org: 1,
          add_sales_org: 1,
          modify_sales_org: 1,
          delete_sales_org: 1,
          list_devices: 1,
          add_devices: 1,
          modify_devices: 1,
          delete_devices: 1,
          list_accounts: 1,
          add_accounts: 1,
          modify_accounts: 1,
          delete_accounts: 1,
          list_prospects: 1,
          add_prospects: 1,
          modify_prospects: 1,
          list_type_accounts: 1,
          add_type_accounts: 1,
          modify_type_accounts: 1,
          delete_type_accounts: 1,
          list_classifications_accounts: 1,
          add_classifications_accounts: 1,
          modify_classifications_accounts: 1,
          delete_classifications_accounts: 1,
          lista_contacts: 1,
          add_contacts: 1,
          modify_contacts: 1,
          delete_contacts: 1,
          list_warehouses: 1,
          add_warehouses: 1,
          modify_warehouses: 1,
          delete_warehouses: 1,
          list_routes: 1,
          add_routes: 1,
          modify_routes: 1,
          delete_routes: 1,
          list_trucks: 1,
          add_trucks: 1,
          modify_trucks: 1,
          delete_trucks: 1,
          list_payment_conditions: 1,
          add_payment_conditions: 1,
          modify_payment_conditions: 1,
          delete_payment_conditions: 1,
          list_competence_business: 1,
          add_competence_business: 1,
          modify_competence_business: 1,
          delete_competence_business: 1,
          list_competence_products: 1,
          add_competence_products: 1,
          modify_competence_products: 1,
          delete_competence_products: 1,
          list_order_type: 1,
          add_order_type: 1,
          modify_order_type: 1,
          delete_order_type: 1,
          list_group_promotions: 1,
          add_group_promotions: 1,
          modify_group_promotions: 1,
          delete_group_promotions: 1,
          list_promotions: 1,
          add_promotions: 1,
          modify_promotions: 1,
          delete_promotions: 1,
          list_orders: 1,
          add_orders: 1,
          modify_orders: 1,
          delete_orders: 1,
          list_orders_history: 1,
          list_collections: 1,
          add_collections: 1,
          modify_collections: 1,
          delete_collections: 1,
          list_collections_pending: 1,
          add_collections_pending: 1,
          modify_collections_pending: 1,
          delete_collections_pending: 1,
          list_returns: 1,
          add_returns: 1,
          modify_returns: 1,
          delete_returns: 1,
          list_credit_note: 1,
          add_credit_note: 1,
          modify_credit_note: 1,
          delete_credit_note: 1,
          list_debit_note: 1,
          add_debit_note: 1,
          modify_debit_note: 1,
          delete_debit_note: 1,
          list_delivery_management: 1,
          add_delivery_management: 1,
          modify_delivery_management: 1,
          delete_delivery_management: 1,
          list_prices_captured: 1,
          add_prices_captured: 1,
          modify_prices_captured: 1,
          delete_prices_captured: 1,
          list_loads: 1,
          add_loads: 1,
          modify_loads: 1,
          delete_loads: 1,
          list_stocks: 1,
          list_reloads: 1,
          add_reloads: 1,
          modify_reloads: 1,
          delete_reloads: 1,
          list_products: 1,
          add_products: 1,
          modify_products: 1,
          delete_products: 1
        };

        // Guardar permisos en el localStorage
        localStorage.setItem('permissions', JSON.stringify(permisosToSend));

        // Hacer la solicitud HTTP POST para agregar permisos
        this.http.post('http://137.184.57.180:3000/api/permissions/insert', permisosToSend, { headers: { 'Content-Type': 'application/json' } }).subscribe(
          (response) => {
            console.log('Permisos agregados:', response);
            Swal.fire({
              title: '¡Éxito!',
              text: 'El rol y los permisos han sido agregados correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.dialogRef.close(newRole); 
          },
          (error) => {
            console.error('Error al agregar los permisos:', error);
            Swal.fire({
              title: '¡Error!',
              text: 'No se pudieron agregar los permisos. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      },
      (error) => {
        console.error('Error al agregar el rol:', error);
        Swal.fire({
          title: '¡Error!',
          text: 'No se pudo agregar el rol. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  ngOnInit(): void {}
}
