import { Component, signal } from '@angular/core';
import { OngletVueEnsemble } from './onglet-vue-ensemble/onglet-vue-ensemble';
import { OngletCompetences } from './onglet-competences/onglet-competences';
import { OngletRapports } from '../manager/onglet-rapports/onglet-rapports';
import { OngletCollaborateurs } from '../manager/onglet-collaborateurs/onglet-collaborateurs';

type Onglet = 'vue-ensemble' | 'competences' | 'rapports' | 'collaborateurs';

@Component({
  selector: 'app-dashboard-rh',
  imports: [OngletVueEnsemble, OngletCompetences, OngletRapports, OngletCollaborateurs],
  templateUrl: './dashboard-rh.html',
  styleUrl: './dashboard-rh.scss',
})
export class DashboardRh {
  protected readonly ongletActif = signal<Onglet>('vue-ensemble');

  choisirOnglet(onglet: Onglet): void {
    this.ongletActif.set(onglet);
  }
}
