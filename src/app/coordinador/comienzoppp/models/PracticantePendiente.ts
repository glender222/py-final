export interface PracticantePendiente {
  id: number;
  estado: string;
  practicanteEpId: number;
  lineaNombre: string;
  razonSocial: string;
  ruc: string;
  direccion: string;
  nombreArea: string;
  descripcionArea: string;
  nombreRepresentante: string;
  apellidoRepresentante: string;
  cargoRepresentante: string;
  telefonoRepresentante: string;
  correoRepresentante: string;
  horas: number | null;
  modalidad: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
}
