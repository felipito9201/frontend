import {MatTableDataSource} from '@angular/material';
import {Informe} from './informe-result.interface';

export interface InformeTabla {
  nombre?: string;
  dataSource?: MatTableDataSource<Informe>;
}
