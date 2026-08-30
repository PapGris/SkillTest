import { Component, inject } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardCollaborateur } from './collaborateur/dashboard-collaborateur';
import { DashboardManager } from './manager/dashboard-manager';
import { DashboardRh } from './rh/dashboard-rh';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, DashboardCollaborateur, DashboardManager, DashboardRh],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly authService = inject(AuthService);
}
