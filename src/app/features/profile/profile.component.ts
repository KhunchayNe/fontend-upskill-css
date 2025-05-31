import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from './interfaces/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [UserService],
})
export class ProfileComponent {
  loading = true;
  user: User | null = null;

  constructor( private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userService.getUserInfo(this.authService.getUserId()).subscribe({
      next: (user: any) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
