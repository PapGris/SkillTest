import { Component, signal } from '@angular/core';
import { OngletParcours } from './onglet-parcours/onglet-parcours';
import { OngletRapports } from './onglet-rapports/onglet-rapports';
import { OngletCollaborateurs } from './onglet-collaborateurs/onglet-collaborateurs';

type Onglet = 'parcours' | 'rapports' | 'collaborateurs';

@Component({
  selector: 'app-dashboard-manager',
  imports: [OngletParcours, OngletRapports, OngletCollaborateurs],
  templateUrl: './dashboard-manager.html',
  styleUrl: './dashboard-manager.scss',
})
export class DashboardManager {
  protected readonly ongletActif = signal<Onglet>('parcours');

  choisirOnglet(onglet: Onglet): void {
    this.ongletActif.set(onglet);
  }
}
