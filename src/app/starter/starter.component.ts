import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Chart} from 'chart.js';

import {ConsultoresResult, Informe, InformeTabla} from '../models';
import {ConsultorService} from '../services/consultor.service';
import {AnnoErrorStateMatcher, annoValidator, MesErrorStateMatcher, mesValidator} from './validator';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {

  displayedColumns: string[] = ['select', 'nombre'];

  dataSourceList: MatTableDataSource<ConsultoresResult>;
  selectionList: SelectionModel<ConsultoresResult> = new SelectionModel<ConsultoresResult>(true, null);
  @ViewChild('MatPaginatorList') paginatorList: MatPaginator;
  @ViewChild('MatSortList') sortList: MatSort;

  dataSourceSelected: MatTableDataSource<ConsultoresResult>;
  selectionSelected: SelectionModel<ConsultoresResult> = new SelectionModel<ConsultoresResult>(true, null);
  @ViewChild('MatPaginatorSelected') paginatorSelected: MatPaginator;
  @ViewChild('MatSortSelected') sortSelected: MatSort;

  list: ConsultoresResult[];
  selected: ConsultoresResult[] = [];

  form: FormGroup;

  meses = [
    {value: '01', desc: 'Enero'},
    {value: '02', desc: 'Febrero'},
    {value: '03', desc: 'Marzo'},
    {value: '04', desc: 'Abril'},
    {value: '05', desc: 'Mayo'},
    {value: '06', desc: 'Junio'},
    {value: '07', desc: 'Julio'},
    {value: '08', desc: 'Agosto'},
    {value: '09', desc: 'Septiembre'},
    {value: '10', desc: 'Octubre'},
    {value: '11', desc: 'Noviembre'},
    {value: '12', desc: 'Diciembre'}
  ];

  annos = ['2005', '2006', '2007', '2008', '2009', '2010'];

  mesErrorStateMatcher = new MesErrorStateMatcher();
  annoErrorStateMatcher = new AnnoErrorStateMatcher();

  displayedColumnsInforme: string[] = ['fecha', 'ganacia', 'comision', 'costo', 'lucro'];
  informes: InformeTabla[] = [];

  informeHidden = true;
  graficoHidden = true;
  pizzaHidden = true;

  grafico: any;
  pizza: any;

  constructor(
    private formBuilder: FormBuilder,
    private consultorService: ConsultorService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      'mes_inicio': ['', Validators.required],
      'anno_inicio': ['', Validators.required],
      'mes_fin': ['', Validators.required],
      'anno_fin': ['', Validators.required]
    }, {
      validators: [mesValidator, annoValidator]
    });
  }

  ngOnInit(): void {
    this.consultorService.selectConsultores().subscribe(resp => {
      this.list = resp;
      this.dataSourceList = new MatTableDataSource<ConsultoresResult>(this.list);
      this.dataSourceList.paginator = this.paginatorList;
      this.dataSourceList.sort = this.sortList;
    });
  }

  filterList(filterValue: string) {
    this.dataSourceList.filter = filterValue.trim().toLowerCase();
  }

  isAllSelectedList() {
    const numSelected = this.selectionList.selected.length;
    const numRows = this.dataSourceList.data.length;
    return numSelected === numRows;
  }

  masterToggleList() {
    this.isAllSelectedList() ?
      this.selectionList.clear() :
      this.dataSourceList.data.forEach(row => this.selectionList.select(row));
  }

  filterSelected(filterValue: string) {
    this.dataSourceSelected.filter = filterValue.trim().toLowerCase();
  }

  isAllSelectedSelected() {
    const numSelected = this.selectionSelected.selected.length;
    const numRows = this.dataSourceSelected.data.length;
    return numSelected === numRows;
  }

  masterToggleSelected() {
    this.isAllSelectedSelected() ?
      this.selectionSelected.clear() :
      this.dataSourceSelected.data.forEach(row => this.selectionSelected.select(row));
  }

  add() {
    if (!this.selectionList.isEmpty()) {
      this.selected.push(...this.selectionList.selected);
      this.dataSourceSelected = new MatTableDataSource<ConsultoresResult>(this.selected);
      this.dataSourceSelected.paginator = this.paginatorSelected;
      this.dataSourceSelected.sort = this.sortSelected;

      this.selectionList.selected.forEach(item => {
        this.list.splice(this.list.indexOf(item), 1);
      });
      this.dataSourceList = new MatTableDataSource<ConsultoresResult>(this.list);
      this.dataSourceList.paginator = this.paginatorList;
      this.dataSourceList.sort = this.sortList;

      this.selectionList.clear();
      this.selectionSelected.clear();
    } else {
      this.snackBar.open('No hay usuarios marcados en Listado', null, {duration: 1500});
    }
  }

  del() {
    if (!this.selectionSelected.isEmpty()) {
      this.list.push(...this.selectionSelected.selected);
      this.dataSourceList = new MatTableDataSource<ConsultoresResult>(this.list);
      this.dataSourceList.paginator = this.paginatorList;
      this.dataSourceList.sort = this.sortList;

      this.selectionSelected.selected.forEach(item => {
        this.selected.splice(this.selected.indexOf(item), 1);
      });
      this.dataSourceSelected = new MatTableDataSource<ConsultoresResult>(this.selected);
      this.dataSourceSelected.paginator = this.paginatorSelected;
      this.dataSourceSelected.sort = this.sortSelected;

      this.selectionSelected.clear();
      this.selectionList.clear();
    } else {
      this.snackBar.open('No hay usuarios marcados en Seleccion', null, {duration: 1500});
    }
  }

  formatDate(date: string) {
    const [year, month] = date.split('-');

    return this.meses.find(item => item.value === month).desc + ' ' + year;
  }

  showInforme() {
    if (this.form.valid) {
      if (this.dataSourceSelected && this.dataSourceSelected.data.length > 0) {

        const inicio = this.form.get('anno_inicio').value + '-' + this.form.get('mes_inicio').value;
        const fin = this.form.get('anno_fin').value + '-' + this.form.get('mes_fin').value;

        const usuarios = [];
        this.dataSourceSelected.data.forEach(item => {
          usuarios.push(item.usuario);
        });

        this.consultorService.selectInforme(usuarios, inicio, fin).subscribe(resp => {
          if (resp) {
            this.informeHidden = false;
            this.graficoHidden = true;
            this.pizzaHidden = true;

            resp.forEach(item => {
              this.informes.push({nombre: item.nombre, dataSource: new MatTableDataSource<Informe>(item.informes)});
            });
          }
        });

      } else {
        this.snackBar.open('No hay usuarios en la tabla Seleccion', null, {duration: 1500});
      }
    }
  }

  totalGanancia(array: Informe[]) {
    return array.map(t => t.ganacia).reduce((acc, value) => acc + value, 0);
  }

  totalComision(array: Informe[]) {
    return array.map(t => t.comision).reduce((acc, value) => acc + value, 0);
  }

  totalCosto(array: Informe[]) {
    return array.map(t => t.costo).reduce((acc, value) => acc + value, 0);
  }

  totalLucro(array: Informe[]) {
    return array.map(t => t.ganacia).reduce((acc, value) => acc + value, 0) -
      array.map(t => t.comision).reduce((acc, value) => acc + value, 0) -
      array.map(t => t.costo).reduce((acc, value) => acc + value, 0);
  }

  showGrafico() {
    if (this.form.valid) {
      if (this.dataSourceSelected && this.dataSourceSelected.data.length > 0) {
        const inicio = this.form.get('anno_inicio').value + '-' + this.form.get('mes_inicio').value;
        const fin = this.form.get('anno_fin').value + '-' + this.form.get('mes_fin').value;

        const usuarios = [];
        this.dataSourceSelected.data.forEach(item => {
          usuarios.push(item.usuario);
        });

        this.consultorService.selectGraficoData(usuarios, inicio, fin).subscribe(resp => {
          if (resp) {
            this.informeHidden = true;
            this.graficoHidden = false;
            this.pizzaHidden = true;


            const labels = [];
            const promedioData = [];
            const gananciaData = [];

            resp.ganancias.forEach(item => {
              labels.push(item.nombre);
              promedioData.push(resp.promedio);
              gananciaData.push(Number(item.ganancia).toFixed(2));
            });

            this.grafico = new Chart('grafico', {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Costo Promedio',
                    fill: false,
                    data: promedioData,
                    backgroundColor: '#de3b34',
                    borderColor: '#de3b34'
                  },
                  {
                    label: 'Ganancia',
                    fill: false,
                    data: gananciaData,
                    backgroundColor: '#168ede',
                    borderColor: '#168ede'
                  }
                ]
              },
              options: {
                tooltips: {
                  enabled: true
                },
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    fontColor: 'black'
                  }
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      fontColor: 'black'
                    }
                  }],
                  xAxes: [{
                    ticks: {
                      fontColor: 'black',
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }
        });
      }
    }
  }

  showPizza() {
    if (this.form.valid) {
      if (this.dataSourceSelected && this.dataSourceSelected.data.length > 0) {

        const inicio = this.form.get('anno_inicio').value + '-' + this.form.get('mes_inicio').value;
        const fin = this.form.get('anno_fin').value + '-' + this.form.get('mes_fin').value;

        const usuarios = [];
        this.dataSourceSelected.data.forEach(item => {
          usuarios.push(item.usuario);
        });

        this.consultorService.selectPizzaData(usuarios, inicio, fin).subscribe(resp => {
          if (resp) {
            this.informeHidden = true;
            this.graficoHidden = true;
            this.pizzaHidden = false;

            const labels = [];
            const data = [];
            const colors = [];

            resp.forEach(item => {
              labels.push(item.nombre);
              data.push(item.porciento);

              let color = this.randomColor();
              while (colors.includes(color)) {
                color = this.randomColor();
              }
              colors.push(color);
            });

            this.pizza = new Chart('pizza', {
              type: 'pie',
              data: {
                datasets: [{
                  data: data,
                  backgroundColor: colors,
                  label: 'Dataset 1'
                }],
                labels: labels
              },
              options: {
                responsive: true,
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    fontColor: 'black'
                  }
                },
              }
            });
          }
        });
      }
    }
  }

  randomColor() {
    return '#' + ((1 << 24) * Math.random() | 0).toString(16);
  }
}
