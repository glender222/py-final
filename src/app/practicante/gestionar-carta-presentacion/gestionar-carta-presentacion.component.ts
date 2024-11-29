import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PersonpracService } from './service/personprac.service';
import { CartaPresentacion, CartaResponse } from './model/cartaprac';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-gestionar-carta-presentacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  templateUrl: './gestionar-carta-presentacion.component.html',
  styleUrl: './gestionar-carta-presentacion.component.css',
  providers: [MessageService]
})
export class GestionarCartaPresentacionComponent implements OnInit {
  carta: CartaPresentacion = {
    razonSocial: '',
    direccion: '',
    ruc: '',
    descripcion: '',
    nombreArea: '',
    descripcionArea: '',
    nombreRepresentante: '',
    apellidoRepresentante: '',
    cargoRepresentante: '',
    telefonoRepresentante: '',
    correoRepresentante: '',
    nombreLinea: 'REDES'
  };

  cartaGuardada?: CartaPresentacion;
  loading: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';
  submitted: boolean = false;

  constructor(private cartaService: PersonpracService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.obtenerCarta();
  }

  obtenerCarta(): void {
    this.loading = true;
    this.cartaService.obtenerCarta().subscribe({
      next: (data: CartaPresentacion) => {
        this.cartaGuardada = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
          detail: 'No hay carta de presentación registrada'
        });
        console.error('Error al obtener carta', error);
        this.loading = false;
      }
    });
  }

  solicitarValidacion(): void {
    if (this.validateForm()) {
      this.loading = true;
      this.cartaService.guardarDatos(this.carta).subscribe({
        next: (response: CartaResponse) => {
          if (response && response.ppp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Carta guardada correctamente'
            });
            this.cartaGuardada = response.ppp;
          }
          this.loading = false;
        },
        error: (errorMsg: string) => {
          console.error('Error específico:', errorMsg);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg
          });
          this.loading = false;
        }
      });
  }
  }
  showList = false;
  selectedItem: any = null;

  onBack() {
    this.showList = false;
    this.selectedItem = null;
  }

  years: { label: string; value: string }[] = [
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  selectedYear: string = '2024';


  private validateForm(): boolean {
    this.submitted = true;
    const requiredFields = [
      'razonSocial',
      'direccion',
      'ruc',
      'descripcion',
      'nombreArea',
      'descripcionArea',
      'nombreRepresentante',
      'apellidoRepresentante',
      'cargoRepresentante',
      'telefonoRepresentante',
      'correoRepresentante'
    ];

    const emptyFields = requiredFields.filter(field => !this.carta[field as keyof CartaPresentacion]);

    if (emptyFields.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos obligatorios'
      });
      return false;
    }

    // Validar formato de correo
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.carta.correoRepresentante)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingrese un correo electrónico válido'
      });
      return false;
    }

    return true;
  }
}
