import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService, Article } from './article.service';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

interface CreateArticleData {
  titre: string;
  description?: string;
  prix: number;
  categorie?: string;
  urlImage: string;
  photoPriseAvecApp: boolean;
  imageFile?: File;
}

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  userArticles: Article[] = [];
  filteredArticles: Article[] = [];
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  articleToEdit: Article | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newArticle: CreateArticleData = {
    titre: '',
    description: '',
    prix: 0,
    categorie: '',
    urlImage: '',
    photoPriseAvecApp: true,
    imageFile: undefined
  };

  selectedImagePreview: string | null = null;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification côté client uniquement
    if (typeof window !== 'undefined' && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier que l'utilisateur est un vendeur
    if (typeof window !== 'undefined') {
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role !== 'VENDEUR') {
            // Rediriger vers la page d'accueil si ce n'est pas un vendeur
            this.router.navigate(['/']);
            return;
          }
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          this.router.navigate(['/login']);
          return;
        }
      }
    }

    this.loadUserArticles();
  }

  loadUserArticles(): void {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      return;
    }

    // Récupérer l'ID de l'utilisateur depuis le token
    const token = this.authService.getToken();
    if (token) {
      try {
        // Décoder le token pour obtenir l'ID utilisateur
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        this.articleService.getArticlesBySeller(userId).subscribe({
          next: (articles) => {
            // Corriger les URLs d'images pour pointer vers l'API backend
            this.userArticles = articles.map(article => ({
              ...article,
              urlImage: article.urlImage.startsWith('/uploads/')
                ? `http://localhost:3000${article.urlImage}`
                : article.urlImage.startsWith('/images/')
                ? `http://localhost:3000${article.urlImage}`
                : article.urlImage
            }));
            this.applyFilters();
          },
          error: (error) => {
            console.error('Erreur lors du chargement des articles:', error);
            // Fallback : afficher un message d'erreur
            this.userArticles = [];
            this.filteredArticles = [];
          }
        });
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        this.userArticles = [];
      }
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  editArticle(article: Article): void {
    this.articleToEdit = article;
    this.newArticle = {
      titre: article.titre,
      description: article.description || '',
      prix: article.prix,
      categorie: article.categorie || '',
      urlImage: article.urlImage,
      photoPriseAvecApp: true,
      imageFile: undefined
    };
    this.selectedImagePreview = article.urlImage;
    this.showEditForm = true;
    this.showCreateForm = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.articleToEdit = null;
    this.resetForm();
  }

  onSubmitArticle(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.newArticle.titre || !this.newArticle.prix) {
      this.errorMessage = 'Titre et prix sont obligatoires.';
      return;
    }

    if (this.newArticle.prix <= 0) {
      this.errorMessage = 'Le prix doit être supérieur à 0.';
      return;
    }

    // Validation de l'image obligatoire seulement pour la création
    if (!this.articleToEdit && !this.newArticle.imageFile && !this.selectedImagePreview) {
      this.errorMessage = 'Une photo de l\'article est obligatoire. Veuillez photographier votre produit.';
      return;
    }

    this.isLoading = true;

    // Préparer les données pour l'envoi
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      this.isLoading = false;
      return;
    }

    const articleData = {
      titre: this.newArticle.titre,
      prix: this.newArticle.prix,
      photoPriseAvecApp: this.newArticle.photoPriseAvecApp,
      urlImage: this.newArticle.urlImage || `/images/article-${Date.now()}.jpg`,
      ...(this.newArticle.description && { description: this.newArticle.description }),
      ...(this.newArticle.categorie && { categorie: this.newArticle.categorie }),
      imageFile: this.newArticle.imageFile // Ajouter le fichier image
    };

    // Créer ou modifier selon le contexte
    const operation = this.articleToEdit
      ? this.articleService.updateArticle(this.articleToEdit.id, articleData, token)
      : this.articleService.createArticle(articleData, token);

    const successMessage = this.articleToEdit
      ? 'Article modifié avec succès !'
      : 'Article créé avec succès !';

    // Envoyer à l'API
    operation.subscribe({
      next: (article) => {
        this.isLoading = false;
        this.successMessage = successMessage;
        this.resetForm();
        this.showCreateForm = false;
        this.showEditForm = false;
        this.articleToEdit = null;
        this.loadUserArticles(); // Recharger la liste

        // Effacer le message de succès après 3 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'opération:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = `Erreur lors de ${this.articleToEdit ? 'la modification' : 'la création'} de l'article. Veuillez réessayer.`;
        }
      }
    });
  }

  resetForm(): void {
    this.newArticle = {
      titre: '',
      description: '',
      prix: 0,
      categorie: '',
      urlImage: '',
      photoPriseAvecApp: true,
      imageFile: undefined
    };
    this.selectedImagePreview = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteArticle(article: Article): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${article.titre}" ? Cette action est irréversible.`)) {
      const token = this.authService.getToken();
      if (!token) {
        this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        return;
      }

      this.articleService.deleteArticle(article.id, token).subscribe({
        next: () => {
          this.successMessage = 'Article supprimé avec succès !';
          this.loadUserArticles(); // Recharger la liste

          // Effacer le message de succès après 3 secondes
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erreur lors de la suppression de l\'article. Veuillez réessayer.';
          }
        }
      });
    }
  }

  applyFilters(): void {
    this.filteredArticles = [...this.userArticles];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedArticles(): Article[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner un fichier image.';
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image ne doit pas dépasser 5MB.';
        return;
      }

      this.newArticle.imageFile = file;
      this.newArticle.photoPriseAvecApp = false; // L'utilisateur importe une image

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openCamera(): void {
    // Ouvrir la caméra/webcam de l'ordinateur
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      this.startCamera();
    } else {
      // Fallback pour les navigateurs qui ne supportent pas getUserMedia
      alert('Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Edge.');
    }
  }

  startCamera(): void {
    if (typeof document !== 'undefined') {
      // Créer un élément vidéo pour la caméra
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);

      // Créer un canvas pour capturer l'image
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      document.body.appendChild(canvas);

      // Demander l'accès à la caméra
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Caméra arrière si disponible
      })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        // Attendre que la vidéo soit prête
        video.onloadedmetadata = () => {
          // Créer une boîte de dialogue pour la capture
          this.showCameraDialog(video, canvas, stream);
        };
      })
      .catch((error) => {
        console.error('Erreur d\'accès à la caméra:', error);
        alert('Impossible d\'accéder à la caméra. Vérifiez les permissions et réessayez.');
      });
    }
  }

  showCameraDialog(video: HTMLVideoElement, canvas: HTMLCanvasElement, stream: MediaStream): void {
    // Créer une overlay pour la caméra
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Conteneur de la caméra
    const cameraContainer = document.createElement('div');
    cameraContainer.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 500px;
      width: 90%;
      text-align: center;
    `;

    // Titre
    const title = document.createElement('h3');
    title.textContent = '📷 Photographiez votre produit';
    title.style.marginBottom = '15px';

    // Vidéo
    video.style.cssText = `
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      display: block;
      margin: 0 auto 15px;
    `;
    video.style.display = 'block';

    // Boutons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    `;

    const captureBtn = document.createElement('button');
    captureBtn.textContent = '📸 Prendre la photo';
    captureBtn.style.cssText = `
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '❌ Annuler';
    cancelBtn.style.cssText = `
      padding: 10px 20px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    `;

    // Assembler l'interface
    buttonContainer.appendChild(captureBtn);
    buttonContainer.appendChild(cancelBtn);
    cameraContainer.appendChild(title);
    cameraContainer.appendChild(video);
    cameraContainer.appendChild(buttonContainer);
    overlay.appendChild(cameraContainer);
    document.body.appendChild(overlay);

    // Gestionnaires d'événements
    captureBtn.onclick = () => {
      this.capturePhoto(video, canvas);
      this.closeCamera(overlay, stream, video, canvas);
    };

    cancelBtn.onclick = () => {
      this.closeCamera(overlay, stream, video, canvas);
    };

    // Fermer avec Échap
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeCamera(overlay, stream, video, canvas);
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
  }

  capturePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Convertir en blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          this.newArticle.imageFile = file;
          this.newArticle.photoPriseAvecApp = true;

          // Créer l'aperçu
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImagePreview = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      }, 'image/jpeg', 0.8);
    }
  }

  closeCamera(overlay: HTMLElement, stream: MediaStream, video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    try {
      // Arrêter le stream
      stream.getTracks().forEach(track => track.stop());

      // Supprimer les éléments en vérifiant s'ils existent encore
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (video && video.parentNode) {
        video.parentNode.removeChild(video);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    } catch (error) {
      console.warn('Erreur lors de la fermeture de la caméra:', error);
      // Essayer une approche alternative
      try {
        stream.getTracks().forEach(track => track.stop());
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      } catch (fallbackError) {
        console.warn('Erreur de fallback:', fallbackError);
      }
    }
  }


  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}