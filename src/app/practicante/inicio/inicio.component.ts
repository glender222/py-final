import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { Toast, ToastModule } from 'primeng/toast';
import { ComenzarpracService } from './service/comenzarprac.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ProgressBarModule,
    ChartModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  loading = false;

  constructor(
    private ComenzarpracService: ComenzarpracService,
    private messageService: MessageService
  ) {}


  // Propiedades generales
  showList = false;
  selectedItem: any = null; // Variable para almacenar el ítem seleccionado
  userCareer: string = 'Ingeniería de Sistemas'; // Carrera del usuario
  period: string = '2024-1'; // Periodo académico
  isPressed: boolean = false; // Estado para manejar el botón presionado
  activeTab = 'calendario'; // Pestaña activa ('calendario' por defecto)

  // Datos del gráfico circular para "Seguimiento de usuario"
  chartData = {
    labels: ['En curso', 'Cubierto', 'Faltante'],
    datasets: [
      {
        data: [50, 30, 20], // Valores para el gráfico
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] // Colores del gráfico
      }
    ]
  };

  // Método para regresar al listado (botón REGRESAR)
  onBack() {
    this.showList = false;
    this.selectedItem = null; // Reinicia la selección al regresar
  }

  // Método para cambiar entre pestañas
  selectTab(tab: string) {
    this.activeTab = tab; // Cambia la pestaña activa ('calendario' o 'seguimiento')
  }

  comenzarPracticas() {
    this.loading = true;
    this.ComenzarpracService.comenzarPracticas().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Prácticas iniciadas correctamente'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al iniciar prácticas'
        });
      },
      complete: () => this.loading = false
    });
  }






}
