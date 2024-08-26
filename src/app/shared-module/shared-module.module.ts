import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../components/form-field/form-field.component';


@NgModule({
  declarations: [
    FormFieldComponent
  ], 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],            
  exports: [
    FormFieldComponent,
    MaterialModule
  ]       
})
export class SharedModule {}