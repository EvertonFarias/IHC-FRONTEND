import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UserService } from '../services/UserService';

@Injectable({
  providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate {
  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Primeiro, forçar o carregamento do usuário para ter dados atualizados
    return this.userService.loadUser().pipe(
      // Mapeie para o status de verificação
      map(user => !!user?.verifiedEmail),
      // Força uma única emissão para que o guard não fique em estado pendente
      take(1),
      // Manipule o resultado da verificação
      tap(isVerified => {
        if (!isVerified) {
          this.showToast('error', 'Você precisa verificar seu e-mail para acessar esta página');
          this.router.navigate(['/user/home']);
        }
      }),
      catchError(error => {
        console.error('Erro no guard de verificação de email:', error);
        this.showToast('error', 'Erro ao verificar seu e-mail');
        this.router.navigate(['/user/home']);
        return of(false);
      })
    );
  }

  private showToast(icon: 'success' | 'error' | 'info' | 'warning', title: string): void {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.style.backgroundColor = '#2c2c2c';
        toast.style.color = '#fff';
        toast.style.borderRadius = '10px';
        toast.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
        toast.style.padding = '1rem 1.5rem';
        toast.style.fontFamily = "'Segoe UI', Arial, sans-serif";

        // Personalizar ícones e bordas com base no tipo de toast
        const iconElement = toast.querySelector('.swal2-icon') as HTMLElement | null;
        if (iconElement) {
          switch (icon) {
            case 'success':
              iconElement.style.color = '#00cc66'; // Verde para sucesso
              (toast as HTMLElement).style.border = '2px solid #00cc66';
              break;
            case 'error':
              iconElement.style.color = '#ff4d4f'; // Vermelho para erro
              (toast as HTMLElement).style.border = '2px solid #ff4d4f';
              break;
            case 'info':
              iconElement.style.color = '#2F80ED'; // Azul para info
              (toast as HTMLElement).style.border = '2px solid #2F80ED';
              break;
            case 'warning':
              iconElement.style.color = '#ffcc00'; // Amarelo para warning
              (toast as HTMLElement).style.border = '2px solid #ffcc00';
              break;
          }
        }

        // Ajustar a barra de progresso
        const progressBar = toast.querySelector('.swal2-progress-bar');
        if (progressBar) {
          (progressBar as HTMLElement).style.backgroundColor = '#a259ff';
        }
      },
      customClass: {
        popup: 'custom-swal-toast'
      }
    });
  }
}