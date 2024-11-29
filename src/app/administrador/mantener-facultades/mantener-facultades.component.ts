import { EscuelaService } from './service/escuela.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Campus } from './models/campus';
import { Facultad } from './models/facultad';
import { Escuela } from './models/escuela';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FacultadService } from './service/facultad.service';
import { CampusService } from './service/campus.service';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { catchError } from 'rxjs/operators';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-mantener-facultades',
  standalone: true,
  imports: [
    FormsModule,
     CommonModule,
      ButtonModule,
      TableModule,
      DialogModule,
      ToastModule,
      InputTextModule,
      PaginatorModule,
      CardModule,
      ConfirmDialogModule,  // Agregar esta línea
      TabViewModule,
      DropdownModule
  ],
  providers: [MessageService, ConfirmationService], // Add MessageService and ConfirmationService to providers
  templateUrl: './mantener-facultades.component.html',
  styleUrl: './mantener-facultades.component.css'
})
export class MantenerFacultadesComponent implements OnInit {
  campusList: Campus[] = [];
  facultades: Facultad[] = [];
  escuelas: Escuela[] = [];

  selectedCampusId?: number;
  selectedFacultadId?: number;

  displayDialog = false;
  newItem: any = {};
  dialogMode: 'campus' | 'facultad' | 'escuela' = 'campus';

  // Pagination variables
  campusRows = 5;
  facultadRows = 5;
  escuelaRows = 5;

  // Edit mode flags
  isEditMode = false;

  // Loading states
  loading = {
    campus: false,
    facultad: false,
    escuela: false
  };

  // Selected items for editing
  selectedCampus?: Campus;
  selectedFacultad?: Facultad;
  selectedEscuela?: Escuela;

  constructor(
    private campusService: CampusService,
    private facultadService: FacultadService,
    private escuelaService: EscuelaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  // Asegúrate de que loadInitialData() se ejecute correctamente
  loadInitialData() {
    this.loading.campus = true;
    this.campusService.getCampus().subscribe({
      next: (data: Campus[]) => {
        this.campusList = data;
        this.loading.campus = false;
        // Cargar facultades después de cargar campus
        this.loadAllFacultades();
      },
      error: (error) => {
        this.showError('Error al cargar campus');
        this.loading.campus = false;
      }
    });
  }

  loadCampus() {
    this.campusService.getCampus().subscribe({
      next: (data: Campus[]) => (this.campusList = data),
      error: (error: any) => this.showError('Error al cargar campus')
    });
  }

  selectCampus(campusId: number) {
    this.selectedCampusId = campusId;
    this.selectedFacultadId = undefined; // Reiniciar la facultad seleccionada al cambiar el campus
    this.facultades = [];
    this.loadFacultades(campusId);
  }

  private verifyAuthentication(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
      // Redirigir al login si es necesario
      return false;
    }
    return true;
  }

  loadFacultades(campusId: number) {
    if (!this.verifyAuthentication()) return;

    this.facultadService.getFacultadesByCampus(campusId).subscribe({
      next: (data) => {
        console.log('Facultades cargadas:', data); // Para debugging
        this.facultades = data;
      },
      error: (error) => {
        console.error('Error detallado:', error);
        if (error.status === 403) {
          this.showError('Sesión expirada o sin autorización. Por favor, inicie sesión nuevamente.');
          // Redirigir al login
        } else {
          this.showError('Error al cargar facultades: ' + error.message);
        }
      }
    });
  }

  loadAllFacultades() {
    this.loading.facultad = true;
    this.facultadService.getAllFacultades().subscribe({
      next: (data: Facultad[]) => {
        this.facultades = data;
        this.loading.facultad = false;
      },
      error: (error: Error) => {
        this.showError('Error al cargar facultades');
        this.loading.facultad = false;
      }
    });
  }

  loadAllEscuelas() {
    this.escuelaService.getAllEscuelas().subscribe({
      next: (data: Escuela[]) => this.escuelas = data,
      error: (error: Error) => this.showError('Error al cargar escuelas')
    });
  }

  selectFacultad(facultadId: number) {
    this.selectedFacultadId = facultadId;
    this.escuelas = [];
    this.loadEscuelas(facultadId);
  }

  loadEscuelas(facultadId: number) {
    this.escuelaService.getEscuelasByFacultad(facultadId).subscribe({
      next: (data) => (this.escuelas = data),
      error: () => this.showError('Error al cargar escuelas')
    });
  }

  showCreateDialog(type: 'campus' | 'facultad' | 'escuela') {
    this.dialogMode = type;
    this.newItem = {};

    // Siempre cargar los campus al abrir el diálogo de facultad
    if (type === 'facultad') {
        this.loading.campus = true;
        this.campusService.getCampus().subscribe({
            next: (data) => {
                this.campusList = data;
                console.log('Campus cargados:', this.campusList); // Para debugging
                this.loading.campus = false;
            },
            error: (error) => {
                console.error('Error al cargar campus:', error);
                this.showError('Error al cargar la lista de campus');
                this.loading.campus = false;
            }
        });
    }

    this.displayDialog = true;
}

  saveNewItem() {
    if (!this.validateNewItem()) {
      return;
    }

    let request: Observable<any>;

    // Primero asignamos el valor a request según el tipo
    switch (this.dialogMode) {
      case 'campus':
        if (this.isEditMode && this.newItem.id) {
          request = this.campusService.updateCampus(this.newItem);
        } else {
          request = this.campusService.createCampus(this.newItem);
        }
        break;
      case 'facultad':
        if (this.isEditMode && this.newItem.id) {
          request = this.facultadService.updateFacultad(this.newItem);
        } else {
          request = this.facultadService.createFacultad(this.newItem);
        }
        break;
      case 'escuela':
        if (this.isEditMode && this.newItem.id) {
          request = this.escuelaService.updateEscuela(this.newItem);
        } else {
          request = this.escuelaService.createEscuela(this.newItem);
        }
        break;
      default:
        this.showError('Tipo de operación no válida');
        return;
    }

    // Ahora podemos estar seguros de que request tiene un valor
    request.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `${this.dialogMode} ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`
        });
        this.displayDialog = false;
        this.refreshCurrentView();
      },
      error: (error) => {
        console.error(error);
        this.showError(`Error al ${this.isEditMode ? 'actualizar' : 'crear'} ${this.dialogMode}`);
      }
    });
  }

  editItem(item: any, type: 'campus' | 'facultad' | 'escuela') {
    this.isEditMode = true;
    this.dialogMode = type;
    this.newItem = { ...item }; // Copia superficial del item
    this.displayDialog = true;
  }

  deleteItem(id: number, type: 'campus' | 'facultad' | 'escuela') {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar este ${type}?`,
      accept: () => {
        this.loading[type] = true;
        let deleteRequest: Observable<void>;

        switch (type) {
          case 'campus':
            deleteRequest = this.campusService.deleteCampus(id);
            break;
          case 'facultad':
            deleteRequest = this.facultadService.deleteFacultad(id);
            break;
          case 'escuela':
            deleteRequest = this.escuelaService.deleteEscuela(id);
            break;
          default:
            return;
        }

        deleteRequest.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${type} eliminado correctamente`
            });
            this.refreshCurrentView();
          },
          error: (error) => {
            console.error(error);
            this.showError(`Error al eliminar ${type}`);
          },
          complete: () => this.loading[type] = false
        });
      }
    });
  }

  onDialogHide() {
    this.isEditMode = false;
    this.newItem = {};
  }

  private validateNewItem(): boolean {
    switch (this.dialogMode) {
      case 'campus':
        if (!this.newItem.sede?.trim()) {
          this.showError('El nombre de la sede es requerido');
          return false;
        }
        break;
      case 'facultad':
        if (!this.newItem.nombre?.trim()) {
          this.showError('El nombre de la facultad es requerido');
          return false;
        }
        if (!this.newItem.idCampus) {
          this.showError('Debe seleccionar un campus');
          return false;
        }
        break;
    }
    return true;
  }

  private refreshCurrentView() {
    switch (this.dialogMode) {
      case 'campus':
        this.loadCampus();
        break;
      case 'facultad':
        if (this.selectedCampusId) {
          this.loadFacultades(this.selectedCampusId);
        }
        break;
      case 'escuela':
        if (this.selectedFacultadId) {
          this.loadEscuelas(this.selectedFacultadId);
        }
        break;
    }
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000 // Mostrar el mensaje por 5 segundos
    });
  }

  // Método para obtener el nombre del campus para las tablas
  getCampusName(campusId: number): string {
    const campus = this.campusList.find(c => c.id === campusId);
    return campus ? campus.sede : 'No encontrado';
  }

  // Método para obtener el nombre de la facultad para las tablas
  getFacultadName(facultadId: number): string {
    const facultad = this.facultades.find(f => f.id === facultadId);
    return facultad ? facultad.nombre : 'No encontrado';
  }
}
