import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RegisterSellerComponent } from './register-seller.component';
import { LoginComponent } from './login.component';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register-seller', component: RegisterSellerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'seller-dashboard', component: SellerDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
