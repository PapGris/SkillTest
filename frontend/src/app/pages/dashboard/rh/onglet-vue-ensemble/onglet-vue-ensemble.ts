import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { ParcoursService } from '../../../../core/services/parcours.service';
import { EvaluationsService } from '../../../../core/services/evaluations.service';
import { CompetencesService } from '../../../../core/services/competences.service';
import { PassagesService } from '../../../../core/services/passages.service';
import type { ParcoursListItem } from '../../../../core/models/gestion.models';

@Component({
  selector: 'app-onglet-vue-ensemble',
  imports: [],
  templateUrl: './onglet-vue-ensemble.html',
  styleUrl: './onglet-vue-ensemble.scss',
})
export class OngletVueEnsemble implements OnInit {
  private readonly parcoursService = inject(ParcoursService);
  private readonly evaluationsService = inject(EvaluationsService);
  private readonly competencesService = inject(CompetencesService);
  private readonly passagesService = inject(PassagesService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);

  protected readonly parcours = signal<ParcoursListItem[]>([]);
  protected readonly totalEvaluations = signal(0);
  protected readonly totalCompetences = signal(0);
  protected readonly totalPassages = signal(0);
  protected readonly scoreMoyenGlobal = signal<number | null>(null);

  ngOnInit(): void {
    forkJoin({
      parcours: this.parcoursService.getTous(),
      evaluations: this.evaluationsService.getToutes(),
      competences: this.competencesService.getToutes(),
    })
      .pipe(
        switchMap(({ parcours, evaluations, competences }) => {
          this.parcours.set(parcours);
          this.totalEvaluations.set(evaluations.length);
          this.totalCompetences.set(competences.length);

          if (evaluations.length === 0) {
            return of([]);
          }
          return forkJoin(evaluations.map((evaluation) => this.passagesService.getPourEvaluation(evaluation.id)));
        }),
      )
      .subscribe({
        next: (groupesDePassages) => {
          const toutesLesTentatives = groupesDePassages.flat();
          this.totalPassages.set(toutesLesTentatives.length);
          this.scoreMoyenGlobal.set(
            toutesLesTentatives.length === 0
              ? null
              : Math.round(
                  (toutesLesTentatives.reduce((somme, p) => somme + p.scoreObtenu, 0) / toutesLesTentatives.length) *
                    10,
                ) / 10,
          );
          this.chargement.set(false);
        },
        error: () => {
          this.erreur.set("Impossible de charger la vue d'ensemble.");
          this.chargement.set(false);
        },
      });
  }
}
