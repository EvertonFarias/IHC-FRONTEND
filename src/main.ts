import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RegisterComponent } from './app/components/register/register.component';
import { LoginComponent } from './app/components/login/login.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { UnauthorizedComponent } from './app/components/unauthorized/unauthorized.component';
import { NotFoundComponent } from './app/components/not-found-component/not-found-component.component';
import { CommonModule } from '@angular/common';
import { AuthRedirectGuard } from './app/guards/AuthRedirectGuard ';
import { AuthGuard } from './app/guards/Auth.guard';
import { RoleGuard } from './app/guards/Role.guard';
import { HomeComponent } from './app/components/user/home/home.component';
import { ForgotPasswordComponent } from './app/components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './app/components/auth/reset-password/reset-password.component';
import { EmailVerifiedGuard } from './app/guards/EmailVerifiedGuard';


(window as any).global = window;

const routes = [

  { path: '', 
    component: LoginComponent, 
    canActivate: [AuthRedirectGuard]  },
  
  { 
    path: 'auth/register', 
    component: RegisterComponent, 
    canActivate: [AuthRedirectGuard] 
  },
  { 
    path: 'auth/login', 
    component: LoginComponent, 
    canActivate: [AuthRedirectGuard] 
  },
  { 
    path: 'auth/forgot-password', 
    component: ForgotPasswordComponent, 
    canActivate: [AuthRedirectGuard] 
  },
  { 
    path: 'auth/reset-password', 
    component: ResetPasswordComponent, 
    canActivate: [AuthRedirectGuard] 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./app/components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard, EmailVerifiedGuard],
    data: { expectedRoles: ['ADMIN'] }
  },
  
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: 'user/home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent, canActivate:[EmailVerifiedGuard]},
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    CommonModule
  ]
}).catch((err) => console.error(err));
