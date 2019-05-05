export interface InformeResult {
  nombre?: string;
  informes?: Informe[];
}

export interface Informe {
  nombre?: string;
  fecha?: string;
  ganacia?: number;
  comision?: number;
  costo?: number;
}
