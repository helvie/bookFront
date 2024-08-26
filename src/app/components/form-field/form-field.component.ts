import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {
  
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() patternErrorMessage?: string;
  @Input() pattern?: string;
  @Input() emailErrorMessage: string = 'Format de mail invalide.';
}
