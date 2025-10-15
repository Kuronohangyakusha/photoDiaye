import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register-seller',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.css']
})
export class RegisterSellerComponent {
  registerData: RegisterData = {
    email: '',
    motDePasse: '',
    nom: '',
    telephone: '',
    role: 'VENDEUR'
  };

  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.registerData.email || !this.registerData.motDePasse || !this.registerData.nom || !this.registerData.telephone) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    if (this.registerData.motDePasse !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.registerData.motDePasse.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    // Format téléphone sénégalais - validation plus flexible
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    const cleanPhone = this.registerData.telephone.replace(/\s+/g, ''); // Supprimer les espaces

    if (!phoneRegex.test(cleanPhone)) {
      this.errorMessage = 'Format de téléphone invalide. Utilisez le format sénégalais (ex: +221771234567 ou 771234567).';
      return;
    }

    // Normaliser le numéro de téléphone
    if (!cleanPhone.startsWith('+221') && !cleanPhone.startsWith('221')) {
      this.registerData.telephone = '+221' + cleanPhone;
    } else if (cleanPhone.startsWith('221')) {
      this.registerData.telephone = '+' + cleanPhone;
    } else {
      this.registerData.telephone = cleanPhone;
    }

    this.isLoading = true;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Compte vendeur créé avec succès ! Vous pouvez maintenant vous connecter.';
        this.authService.saveToken(response.token);

        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'inscription:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Erreur lors de la création du compte. Veuillez réessayer.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}