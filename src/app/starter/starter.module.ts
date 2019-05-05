import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DemoMaterialModule} from '../demo-material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {StarterComponent} from './starter.component';
import {StarterRoutes} from './starter.routing';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forChild(StarterRoutes)
  ],
  declarations: [StarterComponent]
})
export class StarterModule {
}
