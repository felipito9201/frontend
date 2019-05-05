import {Injectable} from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  {state: '/agencia', type: 'link', name: 'Agencia', icon: 'business'},
  {state: '/proyectos', type: 'link', name: 'Proyectos', icon: 'create'},
  {state: '/administracion', type: 'link', name: 'Administracion', icon: 'work'},
  {state: '/comercial', type: 'link', name: 'Comercial', icon: 'account_balance_wallet'},
  {state: '/financiero', type: 'link', name: 'Financiero', icon: 'attach_money'},
  {state: '/usuario', type: 'link', name: 'Usuario', icon: 'person'}
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
