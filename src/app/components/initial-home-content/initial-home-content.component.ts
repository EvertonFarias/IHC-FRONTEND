import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-initial-home-content',
  imports: [RouterModule],
  templateUrl: './initial-home-content.component.html',
  styleUrl: './initial-home-content.component.css'
})
export class InitialHomeContentComponent {
  authenticated: boolean = false;
 

  constructor(private authService: AuthService) {
    this.authenticated = this.authService.isLoggedIn();
  }

}
