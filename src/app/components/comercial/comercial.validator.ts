import {FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

export class MesErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return control && (control.invalid || form.hasError('mesError')) && (control.dirty || control.touched || isSubmitted);
  }
}

export class AnnoErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return control && (control.invalid || form.hasError('annoError')) && (control.dirty || control.touched || isSubmitted);
  }
}

export const mesValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const mesInicio = control.get('mes_inicio').value;
  const annoInicio = control.get('anno_inicio').value;
  const mesFin = control.get('mes_fin').value;
  const annoFin = control.get('anno_fin').value;

  if (mesInicio && annoInicio && mesFin && annoFin) {
    return annoInicio === annoFin && mesInicio > mesFin ? {'mesError': true} : null;
  }

  return null;
};

export const annoValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const annoInicio = control.get('anno_inicio').value;
  const annoFin = control.get('anno_fin').value;

  return annoInicio && annoFin && annoInicio > annoFin ? {'annoError': true} : null;
};
