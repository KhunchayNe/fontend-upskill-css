import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  isLoggedIn$;
  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  goToProfile() {
    // Implement navigation to the profile page
    // Example using Angular Router (if injected):
    this.router.navigate(['/profile']);
  }

  naviateTo(path: string) {
    // Implement navigation to the specified path
    this.router.navigate([path]);
  }
}
