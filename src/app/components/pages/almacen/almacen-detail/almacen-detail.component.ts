import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-almacen-detail',
    templateUrl: './almacen-detail.component.html',
    styleUrls: ['./almacen-detail.component.css'],
    standalone: false
})
export class AlmacenDetailComponent implements OnInit {
  warehouseId!: number;
  warehouseDescription!: string;
  warehouseDetails: any;
  filteredProducts: any[] = [];
  filteredWarehouseProducts: any[] = [];
  products: any[] = [];
  warehouseProducts: any[] = [];
  selectedProductId: number | null = null;
  stock: number | null = null;
  searchTerm: string = '';

  private apiUrl = 'http://137.184.57.180:3000/api/warehouses';
  private productsUrl = 'http://137.184.57.180:3000/api/products';
  private warehouseStockUrl = 'http://137.184.57.180:3000/api/warehousestock';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.warehouseId = +params['id'];
      this.loadWarehouseDetails();
      this.loadProducts(); // Asegurarnos de que los productos se cargan primero
      setTimeout(() => this.loadWarehouseProducts(), 500); // Retrasar la carga para asegurarnos de que los productos estén disponibles
    });
  }

  loadWarehouseDetails(): void {
    this.http.get<any>(`${this.apiUrl}/show_id/${this.warehouseId}`).subscribe(
      (data) => {
        this.warehouseDetails = data;
        this.warehouseDescription = data.description;
      },
      (error) => {
        console.error('Error al cargar detalles del almacén:', error);
      }
    );
  }

  loadProducts(): void {
    this.http.get<any[]>(this.productsUrl).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  loadWarehouseProducts(): void {
    this.http
      .get<any[]>(
        `${this.warehouseStockUrl}/show_warehouses_id/${this.warehouseId}`
      )
      .subscribe(
        (data) => {
          if (this.products.length > 0) {
            this.warehouseProducts = data.map((product) => {
              const matchingProduct = this.products.find(
                (p) => p.id === product.product_id
              );
              return {
                ...product,
                product_description: matchingProduct
                  ? matchingProduct.description
                  : 'Descripción no encontrada',
              };
            });
            this.filteredWarehouseProducts = this.warehouseProducts;
          } else {
            this.warehouseProducts = data;
            this.filteredWarehouseProducts = data;
          }
          console.log('Productos en el almacén:', this.warehouseProducts);
        },
        (error) => {
          console.error('Error al cargar productos del almacén:', error);
        }
      );
  }

  filterWarehouseProducts(): void {
    this.filteredWarehouseProducts = this.warehouseProducts.filter((product) =>
      product.product_description
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  addProductToWarehouse(): void {
    if (this.selectedProductId !== null && this.stock !== null) {
      const newProduct = {
        product_id: this.selectedProductId,
        warehouse_id: this.warehouseId,
        stock: this.stock,
      };

      this.http
        .post<any>(`${this.warehouseStockUrl}/insert`, newProduct)
        .subscribe(
          (data) => {
            console.log('Producto agregado al almacén:', data);
            this.loadWarehouseProducts(); // Recargar los productos del almacén después de agregar uno nuevo
            this.selectedProductId = null; // Limpiar la selección
            this.stock = null; // Limpiar el stock
          },
          (error) => {
            console.error('Error al agregar producto al almacén:', error);
          }
        );
    } else {
      console.warn('Por favor selecciona un producto y especifica el stock.');
    }
  }

  deleteProductFromWarehouse(productId: number): void {
    this.http
      .delete<any>(`${this.warehouseStockUrl}/delete/${productId}`)
      .subscribe(
        (data) => {
          console.log('Producto eliminado del almacén:', data);
          this.loadWarehouseProducts(); // Recargar los productos del almacén después de eliminar uno
        },
        (error) => {
          console.error('Error al eliminar producto del almacén:', error);
        }
      );
  }
}
