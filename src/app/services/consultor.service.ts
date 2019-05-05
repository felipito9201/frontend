import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ConsultoresResult, GraficoData, InformeResult, PizzaData} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConsultorService {

  API_URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
  }

  selectConsultores(): Observable<ConsultoresResult[]> {
    const url = `${this.API_URL}consultores`;
    return this.http.get<ConsultoresResult[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  selectInforme(usuarios: string[], inicio: string, fin: string): Observable<InformeResult[]> {
    const url = `${this.API_URL}informe`;
    return this.http.post<InformeResult[]>(url, {usuarios, inicio, fin}).pipe(
      catchError(this.handleError)
    );
  }

  selectGraficoData(usuarios: string[], inicio: string, fin: string): Observable<GraficoData> {
    const url = `${this.API_URL}grafico`;
    return this.http.post<GraficoData>(url, {usuarios, inicio, fin}).pipe(
      catchError(this.handleError)
    );
  }

  selectPizzaData(usuarios: string[], inicio: string, fin: string): Observable<PizzaData[]> {
    const url = `${this.API_URL}pizza`;
    return this.http.post<PizzaData[]>(url, {usuarios, inicio, fin}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
