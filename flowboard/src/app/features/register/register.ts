import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[@$!%*?&])/)]],
    passwordConfirm: ['', Validators.required]
  }, { validators: this.passwordsMatch });

  // Custom validator per conferma password
  private passwordsMatch(group: AbstractControl) {
  const pass = group.get('password');
  const confirm = group.get('passwordConfirm');

  if (!pass || !confirm) return null;

  const mismatch = pass.value !== confirm.value;
  if (mismatch) {
    confirm.setErrors({ passwordsMismatch: true });
  } else {
    //  se le password coincidono rimuovo l’errore passwordsMismatch
    const errors = confirm.errors;
    if (errors) {
      delete errors['passwordsMismatch'];
      if (Object.keys(errors).length === 0) {
        confirm.setErrors(null);
      } else {
        confirm.setErrors(errors);
      }
    }
  }
  return null;
}


  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { email, password} = this.form.value;

    this.auth.register(email!, password!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = true
    });
  }

   getControl(path: string) {
  return this.form.get(path);
  }

  hasError(path: string, errorCode: string): boolean {
  const control = this.getControl(path);
  return !!control && control.hasError(errorCode) && control.touched;
  }
}
