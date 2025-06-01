import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  form;
  token = '';
  success = '';
  error = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', Validators.required]
    });

    // Pega o token da URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'Token não encontrado na URL.';
    }
  }

  // Validador para força da senha
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const password = control.value;
    const errors: any = {};

    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = 'Deve conter pelo menos uma letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = 'Deve conter pelo menos uma letra maiúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Deve conter pelo menos um número';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.special = 'Deve conter pelo menos um caractere especial (@$!%*?&)';
    }

    return Object.keys(errors).length ? { passwordStrength: errors } : null;
  }

  // Método para obter erros de senha em tempo real
  getPasswordErrors(): string[] {
    const passwordField = this.form.get('password');
    if (!passwordField?.value) return [];

    const password = passwordField.value;
    const errors: string[] = [];

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Deve conter pelo menos um número');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Deve conter pelo menos um caractere especial (@$!%*?&)');
    }
    if (password.length < 8) {
      errors.push('Pelo menos 8 caracteres');
    }

    return errors;
  }

  submit() {
    // Reset messages
    this.success = '';
    this.error = '';
    
    if (this.form.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente.';
      return;
    }
    
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'As senhas não coincidem.';
      return;
    }

    if (!this.token) {
      this.error = 'Token não encontrado. Por favor, verifique o link recebido por email.';
      return;
    }
    
    this.isSubmitting = true;
    const body = {
      token: this.token,
      newPassword: this.form.value.password
    };

    this.http.post(`${environment.apiUrl}/auth/reset-password`, body, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.success = 'Senha redefinida com sucesso!';
          this.error = '';
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro na requisição:', err);
          if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else {
            this.error = `Erro ao redefinir a senha. (${err.status}: ${err.statusText})`;
          }
          this.success = '';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}