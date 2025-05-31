import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.error = null;

    // Mock register logic
    if (!this.email.includes('@')) {
      this.error = 'ข้อมูล email ไม่ถูกต้อง';
    } else if (this.password.length < 6) {
      this.error = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    } else {
      // ในระบบจริง: ส่งไปยัง backend
      this.auth
        .register({
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: (data: any) => {
            if (data.status === 'error') {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message,
              });

              this.error = 'การลงทะเบียนล้มเหลว: ' + data.message;
              this.loading = false;
              return;
            }
            this.loading = false;
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.error =
              'การลงทะเบียนล้มเหลว: ' +
              (err.error?.message || 'เกิดข้อผิดพลาด');
          },
        });
    }

    this.loading = false;
  }
}
