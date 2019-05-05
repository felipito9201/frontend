import {Routes} from '@angular/router';

import {FullComponent} from './layouts/full/full.component';
import {ComercialComponent} from './components/comercial/comercial.component';
import {AdministracionComponent} from './components/administracion/administracion.component';
import {AgenciaComponent} from './components/agencia/agencia.component';
import {FinancieroComponent} from './components/financiero/financiero.component';
import {ProyectosComponent} from './components/proyectos/proyectos.component';
import {UsuarioComponent} from './components/usuario/usuario.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {path: '', redirectTo: 'comercial', pathMatch: 'full'},
      {path: 'comercial', component: ComercialComponent},
      {path: 'administracion', component: AdministracionComponent},
      {path: 'agencia', component: AgenciaComponent},
      {path: 'financiero', component: FinancieroComponent},
      {path: 'proyectos', component: ProyectosComponent},
      {path: 'usuario', component: UsuarioComponent},
      {path: '**', redirectTo: 'comercial'},
    ]
  }
];
