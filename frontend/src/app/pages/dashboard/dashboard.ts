import { Component, inject } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardCollaborateur } from './collaborateur/dashboard-collaborateur';
import { DashboardManager } from './manager/dashboard-manager';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, DashboardCollaborateur, DashboardManager],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly authService = inject(AuthService);
}
