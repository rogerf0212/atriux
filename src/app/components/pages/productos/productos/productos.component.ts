import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.css'],
    standalone: false
})
export class ProductosComponent implements OnInit {
  products: any[] = [];
  unitMeasures: any[] = [];
  productCategories: any[] = [];
  productHierarchies: any[] = [];
  productClassificationsA: any[] = [];
  productClassificationsB: any[] = [];
  taxes: any[] = [];
  searchTerm: string = '';
  newProductDescription: string = '';
  newProductCost: number | null = null;
  newProductUnitMeasure: number | null = null;
  newProductCategory: number | null = null;
  newProductHierarchy: number | null = null;
  newProductClassificationA: number | null = null;
  newProductClassificationB: number | null = null;
  newProductTaxes: number | null = null;
  newProductImageUrl: string = '';
  newProductImageBase64: string = '';
  isAddContainerExpanded: boolean = false;
  viewMode: 'list' | 'cards' = 'list';
  private baseUrl = 'http://137.184.57.180:3000/api/products';
  private imageBasePath = 'http://137.184.57.180:3000/images/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Cargar datos de referencia
    this.loadUnitMeasures();
    this.loadProductCategories();
    this.loadProductHierarchies();
    this.loadProductClassificationsA();
    this.loadProductClassificationsB();
    this.loadTaxes();

    // Cargar productos después de cargar datos de referencia
    setTimeout(() => this.loadProducts(), 1000);
  }

  toggleAddContainer(): void {
    this.isAddContainerExpanded = !this.isAddContainerExpanded;
  }

  toggleView(mode: 'list' | 'cards'): void {
    this.viewMode = mode;
  }

  loadProducts(): void {
    this.http.get<any[]>(this.baseUrl).subscribe(
      (data) => {
        this.products = data.map((product) => ({
          ...product,
          unit_measure_description: this.getUnitMeasureDescription(
            product.unit_measure
          ),
          product_category_description: this.getProductCategoryDescription(
            product.product_category
          ),
          product_hierarchy_description: this.getProductHierarchyDescription(
            product.product_hierarchy
          ),
          product_classification_a_description:
            this.getProductClassificationADescription(
              product.product_classification_a
            ),
          product_classification_b_description:
            this.getProductClassificationBDescription(
              product.product_classification_b
            ),
          taxes_description: this.getTaxesDescription(product.taxes),
          tax_amount: this.calculateTaxAmount(product.costo, product.taxes),
        }));
      },
      (error) => console.error(error)
    );
  }

  calculateTaxAmount(cost: number, taxId: number): string {
    const tax = this.taxes.find((item) => item.id === taxId);
    if (tax) {
      const percentage = tax.num_percentage;
      const taxAmount = (cost * percentage) / 100;
      return `${taxAmount.toFixed(2)} (${percentage}%)`;
    } else {
      return 'Desconocido';
    }
  }

  loadUnitMeasures(): void {
    this.http
      .get<any[]>('http://137.184.57.180:3000/api/unitsmeasure')
      .subscribe(
        (data) => (this.unitMeasures = data),
        (error) => console.error(error)
      );
  }

  loadProductCategories(): void {
    this.http
      .get<any[]>('http://137.184.57.180:3000/api/productscategory')
      .subscribe(
        (data) => (this.productCategories = data),
        (error) => console.error(error)
      );
  }

  loadProductHierarchies(): void {
    this.http
      .get<any[]>('http://137.184.57.180:3000/api/productshierarchy')
      .subscribe(
        (data) => (this.productHierarchies = data),
        (error) => console.error(error)
      );
  }

  loadProductClassificationsA(): void {
    this.http
      .get<any[]>('http://137.184.57.180:3000/api/productsclasificaciona')
      .subscribe(
        (data) => (this.productClassificationsA = data),
        (error) => console.error(error)
      );
  }

  loadProductClassificationsB(): void {
    this.http
      .get<any[]>('http://137.184.57.180:3000/api/productsclasificacionb')
      .subscribe(
        (data) => (this.productClassificationsB = data),
        (error) => console.error(error)
      );
  }

  loadTaxes(): void {
    this.http.get<any[]>('http://137.184.57.180:3000/api/taxes').subscribe(
      (data) => {
        this.taxes = data.map((tax) => ({
          id: tax.id,
          description: tax.description,
          num_percentage: tax.num_percentage,
        }));
      },
      (error) => console.error(error)
    );
  }

  getUnitMeasureDescription(id: number): string {
    const measure = this.unitMeasures.find((item) => item.id === id);
    return measure ? measure.description : 'Desconocido';
  }

  getProductCategoryDescription(id: number): string {
    const category = this.productCategories.find((item) => item.id === id);
    return category ? category.description : 'Desconocido';
  }

  getProductHierarchyDescription(id: number): string {
    const hierarchy = this.productHierarchies.find((item) => item.id === id);
    return hierarchy ? hierarchy.description : 'Desconocido';
  }

  getProductClassificationADescription(id: number): string {
    const classification = this.productClassificationsA.find(
      (item) => item.id === id
    );
    return classification ? classification.description : 'Desconocido';
  }

  getProductClassificationBDescription(id: number): string {
    const classification = this.productClassificationsB.find(
      (item) => item.id === id
    );
    return classification ? classification.description : 'Desconocido';
  }

  getTaxesDescription(id: number): string {
    const tax = this.taxes.find((item) => item.id === id);
    return tax ? `${tax.description} (${tax.num_percentage}%)` : 'Desconocido';
  }

  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        localStorage.setItem(file.name, base64); // Guarda la imagen en el almacenamiento local
        this.newProductImageUrl = file.name; // Toma el nombre del archivo
        this.newProductImageBase64 = base64; // Guarda la base64 para previsualización
      };
      reader.readAsDataURL(file);
    }
  }

  createProduct(): void {
    if (
      this.newProductDescription.trim() === '' ||
      this.newProductCost === null ||
      this.newProductUnitMeasure === null ||
      this.newProductCategory === null ||
      this.newProductHierarchy === null ||
      this.newProductClassificationA === null ||
      this.newProductClassificationB === null ||
      this.newProductTaxes === null ||
      this.newProductImageUrl.trim() === ''
    ) {
      console.warn('Todos los campos son requeridos');
      return;
    }

    const newProduct = {
      description: this.newProductDescription,
      costo: this.newProductCost,
      unit_measure: this.newProductUnitMeasure,
      product_category: this.newProductCategory,
      product_hierarchy: this.newProductHierarchy,
      product_classification_a: this.newProductClassificationA,
      product_classification_b: this.newProductClassificationB,
      taxes: this.newProductTaxes,
      url_imagen: this.newProductImageUrl, // Usa el nombre del archivo
    };

    this.http.post<any>(`${this.baseUrl}/insert`, newProduct).subscribe(
      (data) => {
        console.log(data);
        this.loadProducts(); // Recarga los productos después de agregar uno nuevo
        this.resetForm(); // Limpia el formulario
      },
      (error) => console.error(error)
    );
  }

  updateProduct(id: number): void {
    if (
      this.newProductDescription.trim() === '' ||
      this.newProductCost === null ||
      this.newProductUnitMeasure === null ||
      this.newProductCategory === null ||
      this.newProductHierarchy === null ||
      this.newProductClassificationA === null ||
      this.newProductClassificationB === null ||
      this.newProductTaxes === null ||
      this.newProductImageUrl.trim() === ''
    ) {
      console.warn('Todos los campos son requeridos');
      return;
    }

    const updatedProduct = {
      id: id,
      description: this.newProductDescription,
      costo: this.newProductCost,
      unit_measure: this.newProductUnitMeasure,
      product_category: this.newProductCategory,
      product_hierarchy: this.newProductHierarchy,
      product_classification_a: this.newProductClassificationA,
      product_classification_b: this.newProductClassificationB,
      taxes: this.newProductTaxes,
      url_imagen: this.newProductImageUrl, // Usa el nombre del archivo
    };

    this.http.post<any>(`${this.baseUrl}/update`, updatedProduct).subscribe(
      (data) => {
        console.log(data);
        this.loadProducts(); // Recarga los productos después de actualizar uno existente
        this.resetForm(); // Limpia el formulario
      },
      (error) => console.error(error)
    );
  }

  deleteProduct(id: number): void {
    this.http.delete<any>(`${this.baseUrl}/delete/${id}`).subscribe(
      data => {
        console.log('Producto eliminado con éxito:', data);
  
        // Eliminar del almacenamiento local
        const product = this.products.find(p => p.id === id);
        if (product && product.url_imagen) {
          localStorage.removeItem(product.url_imagen);
        }
  
        // Eliminar de la lista de productos
        this.products = this.products.filter(p => p.id !== id);
      },
      error => console.error('Hubo un problema al eliminar el producto:', error)
    );
  }
  
  
  

  resetForm(): void {
    this.newProductDescription = '';
    this.newProductCost = null;
    this.newProductUnitMeasure = null;
    this.newProductCategory = null;
    this.newProductHierarchy = null;
    this.newProductClassificationA = null;
    this.newProductClassificationB = null;
    this.newProductTaxes = null;
    this.newProductImageUrl = '';
    this.newProductImageBase64 = '';
  }

  filterProducts(): void {
    this.products = this.products.filter((product) =>
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getProductImageUrl(imageUrl: string): string {
    const base64 = localStorage.getItem(imageUrl);
    return base64 ? base64 : `${this.imageBasePath}${imageUrl}`;
  }
}
