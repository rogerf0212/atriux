import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-produc-manage',
    templateUrl: './produc-manage.component.html',
    styleUrls: ['./produc-manage.component.css'],
    standalone: false
})
export class ProducManageComponent implements OnInit {
  categories: any[] = [];
  classificationA: any[] = [];
  classificationB: any[] = [];
  establishments: any[] = [];
  priceLists: any[] = [];
  taxes: any[] = [];
  unitsMeasures: any[] = [];
  conversions: any[] = [];
  newCategoryDescription: string = '';
  newClassificationADescription: string = '';
  newClassificationBDescription: string = '';
  newEstablishmentDescription: string = '';
  newPriceListDescription: string = '';
  newPriceListDateInit: string = '';
  newPriceListDateEnd: string = '';
  newTaxDescription: string = '';
  newTaxPercentage: number | null = null;
  newUnitsMeasureDescription: string = '';
  newUnitsMeasureShort: string = '';
  newConversionUnitOrigen: number | null = null;
  newConversionUnitDestiny: number | null = null;
  newConversionAmount: number | null = null;
  selectedTab: string = 'categories';
  private baseUrlCategory = 'http://137.184.57.180:3000/api/productscategory';
  private baseUrlClassificationA =
    'http://137.184.57.180:3000/api/productsclasificaciona';
  private baseUrlClassificationB =
    'http://137.184.57.180:3000/api/productsclasificacionb';
  private baseUrlEstablishment =
    'http://137.184.57.180:3000/api/productshierarchy';
  private baseUrlPriceList = 'http://137.184.57.180:3000/api/pricelist';
  private baseUrlTaxes = 'http://137.184.57.180:3000/api/taxes';
  private baseUrlUnitsMeasure = 'http://137.184.57.180:3000/api/unitsmeasure';
  private baseUrlConversions = 'http://137.184.57.180:3000/api/unitsconvertion';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadClassificationA();
    this.loadClassificationB();
    this.loadEstablishments();
    this.loadPriceLists();
    this.loadTaxes();
    this.loadUnitsMeasures();
    this.loadConversions();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  loadCategories(): void {
    this.http.get<any[]>(this.baseUrlCategory).subscribe(
      (data) => (this.categories = data),
      (error) => console.error(error)
    );
  }

  createCategory(description: string): void {
    if (description.trim() === '') {
      console.warn('La descripción de la categoría no puede estar vacía');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlCategory}/insert`, { description })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadCategories(); // Recarga las categorías después de agregar una nueva
          this.newCategoryDescription = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadClassificationA(): void {
    this.http.get<any[]>(this.baseUrlClassificationA).subscribe(
      (data) => (this.classificationA = data),
      (error) => console.error(error)
    );
  }

  createClassificationA(description: string): void {
    if (description.trim() === '') {
      console.warn('La descripción de la clasificación A no puede estar vacía');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlClassificationA}/insert`, { description })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadClassificationA(); // Recarga las clasificaciones A después de agregar una nueva
          this.newClassificationADescription = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadClassificationB(): void {
    this.http.get<any[]>(this.baseUrlClassificationB).subscribe(
      (data) => (this.classificationB = data),
      (error) => console.error(error)
    );
  }

  createClassificationB(description: string): void {
    if (description.trim() === '') {
      console.warn('La descripción de la clasificación B no puede estar vacía');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlClassificationB}/insert`, { description })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadClassificationB(); // Recarga las clasificaciones B después de agregar una nueva
          this.newClassificationBDescription = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadEstablishments(): void {
    this.http.get<any[]>(this.baseUrlEstablishment).subscribe(
      (data) => (this.establishments = data),
      (error) => console.error(error)
    );
  }

  createEstablishment(description: string): void {
    if (description.trim() === '') {
      console.warn('La descripción del establecimiento no puede estar vacía');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlEstablishment}/insert`, { description })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadEstablishments(); // Recarga los establecimientos después de agregar uno nuevo
          this.newEstablishmentDescription = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadPriceLists(): void {
    this.http.get<any[]>(this.baseUrlPriceList).subscribe(
      (data) => (this.priceLists = data),
      (error) => console.error(error)
    );
  }

  createPriceList(
    description: string,
    dateInit: string,
    dateEnd: string
  ): void {
    if (
      description.trim() === '' ||
      dateInit.trim() === '' ||
      dateEnd.trim() === ''
    ) {
      console.warn('Todos los campos son requeridos');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlPriceList}/insert`, {
        description,
        date_init: dateInit,
        date_end: dateEnd,
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadPriceLists(); // Recarga las listas de precios después de agregar una nueva
          this.newPriceListDescription = ''; // Limpia el campo de entrada
          this.newPriceListDateInit = ''; // Limpia el campo de entrada
          this.newPriceListDateEnd = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadTaxes(): void {
    this.http.get<any[]>(this.baseUrlTaxes).subscribe(
      data => {
        console.log(data); // Añadimos un console.log para verificar los datos obtenidos
        this.taxes = data.map(tax => ({
          description: tax.description,
          num_percentage: tax.num_percentage,
          description_with_percentage: `${tax.description} (${tax.num_percentage}%)`
        }));
      },
      error => console.error(error)
    );
  }
  

  createTax(description: string, percentage: number): void {
    if (description.trim() === '' || percentage === null) {
      console.warn('Todos los campos son requeridos');
      return;
    }
    const newTax = {
      description: description,
      percentage: percentage,
    };
    this.http.post<any>(`${this.baseUrlTaxes}/insert`, newTax).subscribe(
      (data) => {
        console.log(data);
        this.loadTaxes(); // Recarga los impuestos después de agregar uno nuevo
        this.newTaxDescription = ''; // Limpia el campo de entrada
        this.newTaxPercentage = null; // Limpia el campo de entrada
      },
      (error) => console.error(error)
    );
  }

  validateTaxPercentage(): void {
    if (this.newTaxPercentage === null) {
      this.newTaxPercentage = 0;
    }
  }

  loadUnitsMeasures(): void {
    this.http.get<any[]>(this.baseUrlUnitsMeasure).subscribe(
      (data) => (this.unitsMeasures = data),
      (error) => console.error(error)
    );
  }

  createUnitsMeasure(description: string, short: string): void {
    if (description.trim() === '' || short.trim() === '') {
      console.warn('Todos los campos son requeridos');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlUnitsMeasure}/insert`, { description, short })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadUnitsMeasures(); // Recarga las unidades de medida después de agregar una nueva
          this.newUnitsMeasureDescription = ''; // Limpia el campo de entrada
          this.newUnitsMeasureShort = ''; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  loadConversions(): void {
    this.http.get<any[]>(this.baseUrlConversions).subscribe(
      (data) => (this.conversions = data),
      (error) => console.error(error)
    );
  }

  createConversion(
    unitOrigen: number,
    unitDestiny: number,
    amountConvertion: number
  ): void {
    if (
      unitOrigen === null ||
      unitDestiny === null ||
      amountConvertion === null
    ) {
      console.warn('Todos los campos son requeridos');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlConversions}/insert`, {
        unit_origen: unitOrigen,
        unit_destiny: unitDestiny,
        amount_convertion: amountConvertion,
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadConversions(); // Recarga las conversiones después de agregar una nueva
          this.newConversionUnitOrigen = null; // Limpia el campo de entrada
          this.newConversionUnitDestiny = null; // Limpia el campo de entrada
          this.newConversionAmount = null; // Limpia el campo de entrada
        },
        (error) => console.error(error)
      );
  }

  updateConversion(
    id: number,
    unitOrigen: number,
    unitDestiny: number,
    amountConvertion: number
  ): void {
    if (
      id === null ||
      unitOrigen === null ||
      unitDestiny === null ||
      amountConvertion === null
    ) {
      console.warn('Todos los campos son requeridos');
      return;
    }
    this.http
      .post<any>(`${this.baseUrlConversions}/update`, {
        id,
        unit_origen: unitOrigen,
        unit_destiny: unitDestiny,
        amount_convertion: amountConvertion,
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loadConversions(); // Recarga las conversiones después de actualizar una existente
        },
        (error) => console.error(error)
      );
  }

  deleteConversion(id: number): void {
    if (id === null) {
      console.warn('El ID es requerido');
      return;
    }
    this.http.delete<any>(`${this.baseUrlConversions}/delete/${id}`).subscribe(
      (data) => {
        console.log(data);
        this.loadConversions(); // Recarga las conversiones después de eliminar una existente
      },
      (error) => console.error(error)
    );
  }

  getTaxDescription(id: number): string {
    const tax = this.taxes.find((item) => item.id === id);
    return tax ? `${tax.description} (${tax.percentage}%)` : 'Desconocido';
  }
}
