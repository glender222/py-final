import { CommonModule } from "@angular/common";
import { CartaPresentacionComponent } from "../carta-presentacion/carta-presentacion.component";
import { RequisitosFinalesComponent } from "../requisitos-finales/requisitos-finales.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { AvatarModule } from "primeng/avatar";
import { SidebarcoordinadorComponent } from "../sidebarcoordinador/sidebarcoordinador.component";
import { RouterLink } from "@angular/router";
import { PracticanteEP } from "../models/practicante-ep/practicante-ep.module";
import { Practicas } from "../models/practica/practica.module";
import { Component } from "@angular/core";
import { PracticantePendiente } from "./models/PracticantePendiente";
import { PractsService } from "../validacion/service/practs.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-comienzoppp',
  standalone: true,
  imports: [ToastModule,
    CartaPresentacionComponent,
    RequisitosFinalesComponent,
    CommonModule,
     FormsModule,
      ButtonModule,
       InputTextModule,
        AvatarModule],
  templateUrl: './comienzoppp.component.html',
  styleUrl: './comienzoppp.component.css',
  providers: [MessageService]
})
export class ComienzopppComponent {
  practicantes: PracticantePendiente[] = [];
  filteredPracticantes: PracticantePendiente[] = [];
  selectedPracticante: PracticantePendiente | null = null;
  searchQuery: string = '';

  constructor(private practsService: PractsService,     private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPracticantes();
  }

  loadPracticantes() {
    this.practsService.getPracticantesPendientes().subscribe({
      next: (data) => {
        this.practicantes = data;
        this.filteredPracticantes = data;
      },
      error: (error) => {
        console.error('Error loading practicantes:', error);
      }
    });
  }

  filterPracticantes() {
    this.filteredPracticantes = this.practicantes.filter((practicante) =>
      practicante.razonSocial.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      practicante.lineaNombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectPracticante(practicante: PracticantePendiente) {
    this.selectedPracticante = practicante;
  }

  aprobarPracticante(id: number) {
    this.practsService.aprobarPracticante(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Practicante aprobado correctamente'
        });
        this.loadPracticantes();
        this.selectedPracticante = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al aprobar practicante'
        });
      }
    });
  }

  rechazarPracticante(id: number) {
    this.practsService.rechazarPracticante(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Practicante rechazado'
        });
        this.loadPracticantes();
        this.selectedPracticante = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al rechazar practicante'
        });
      }
    });
  }
}
