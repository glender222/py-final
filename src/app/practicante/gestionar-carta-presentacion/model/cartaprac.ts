export interface CartaPresentacion {
  id?: number;
  razonSocial: string;
  direccion: string;
  ruc: string;
  descripcion: string;
  nombreArea: string;
  descripcionArea: string;
  nombreRepresentante: string;
  apellidoRepresentante: string;
  cargoRepresentante: string;
  telefonoRepresentante: string;
  correoRepresentante: string;
  nombreLinea: string;
  estado?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CartaResponse {
  mensaje: string;
  ppp: CartaPresentacion;
}
