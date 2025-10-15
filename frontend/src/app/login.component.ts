import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginData = {
    email: '',
    motDePasse: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    // Validation
    if (!this.loginData.email || !this.loginData.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveToken(response.token);

        // Rediriger selon le rôle
        if (response.user.role === 'VENDEUR') {
          if (this.router) {
            this.router.navigate(['/seller-dashboard']);
          }
        } else if (response.user.role === 'ADMIN') {
          if (this.router) {
            this.router.navigate(['/admin-dashboard']);
          }
        } else {
          if (this.router) {
            this.router.navigate(['/']);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la connexion:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Erreur lors de la connexion. Vérifiez vos identifiants.';
        }
      }
    });
  }

  goBack(): void {
    if (this.router) {
      this.router.navigate(['/']);
    }
  }

  goToRegister(): void {
    if (this.router) {
      this.router.navigate(['/register-seller']);
    }
  }
}