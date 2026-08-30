import { Component, signal } from '@angular/core';
import { OngletCompetences } from './onglet-competences/onglet-competences';
import { OngletEvaluations } from './onglet-evaluations/onglet-evaluations';
import { OngletHistorique } from './onglet-historique/onglet-historique';

type Onglet = 'evaluations' | 'competences' | 'historique';

@Component({
  selector: 'app-dashboard-collaborateur',
  imports: [OngletCompetences, OngletEvaluations, OngletHistorique],
  templateUrl: './dashboard-collaborateur.html',
  styleUrl: './dashboard-collaborateur.scss',
})
export class DashboardCollaborateur {
  protected readonly ongletActif = signal<Onglet>('evaluations');

  choisirOnglet(onglet: Onglet): void {
    this.ongletActif.set(onglet);
  }
}
