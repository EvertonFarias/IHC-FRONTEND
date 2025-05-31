// header.component.ts
import { ChangeDetectorRef, Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserInfoComponent } from "./user-info/user-info.component";
import { AuthButtonsComponent } from "./auth-buttons/auth-buttons.component";
import { UserDTO, UserService } from '../../services/UserService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [CommonModule, RouterModule, UserInfoComponent, AuthButtonsComponent],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authenticated: boolean = false;
  showProfileDropdown: boolean = false;
  showMobileMenu: boolean = false;
  private authSubscription!: Subscription;
  user$: Observable<UserDTO | null>;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.user$ = this.userService.user$;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(isLogged => {
      this.authenticated = isLogged;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  viewProfile(): void {
    this.showProfileDropdown = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.showProfileDropdown = false;
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Fecha dropdown de perfil se clicar fora
    if (!target.closest('.profile-container')) {
      this.showProfileDropdown = false;
    }
    
    // Fecha menu mobile se clicar fora (apenas em telas menores)
    if (!target.closest('.navbar') && !target.closest('.mobile-menu-btn')) {
      this.showMobileMenu = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Fecha menu mobile ao redimensionar para desktop
    const target = event.target as Window;
    if (target.innerWidth > 768) {
      this.showMobileMenu = false;
    }
  }
}