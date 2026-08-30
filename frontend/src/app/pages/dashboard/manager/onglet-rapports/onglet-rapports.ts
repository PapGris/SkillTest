import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EvaluationsService } from '../../../../core/services/evaluations.service';
import { PassagesService } from '../../../../core/services/passages.service';
import type { EvaluationListItem } from '../../../../core/models/quiz.models';
import type { PassageRapport } from '../../../../core/models/gestion.models';

@Component({
  selector: 'app-onglet-rapports',
  imports: [DatePipe],
  templateUrl: './onglet-rapports.html',
  styleUrl: './onglet-rapports.scss',
})
export class OngletRapports implements OnInit {
  private readonly evaluationsService = inject(EvaluationsService);
  private readonly passagesService = inject(PassagesService);

  protected readonly evaluations = signal<EvaluationListItem[]>([]);
  protected readonly evaluationSelectionnee = signal<EvaluationListItem | null>(null);
  protected readonly passages = signal<PassageRapport[]>([]);

  protected readonly chargement = signal(true);
  protected readonly chargementPassages = signal(false);
  protected readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.evaluationsService.getToutes().subscribe({
      next: (evaluations) => {
        this.evaluations.set(evaluations);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les evaluations.');
        this.chargement.set(false);
      },
    });
  }

  protected selectionnerEvaluation(evaluation: EvaluationListItem): void {
    this.evaluationSelectionnee.set(evaluation);
    this.chargementPassages.set(true);
    this.passagesService.getPourEvaluation(evaluation.id).subscribe({
      next: (passages) => {
        this.passages.set(passages);
        this.chargementPassages.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les tentatives.');
        this.chargementPassages.set(false);
      },
    });
  }

  protected retourListeEvaluations(): void {
    this.evaluationSelectionnee.set(null);
    this.passages.set([]);
  }

  protected moyenne(): number | null {
    const liste = this.passages();
    if (liste.length === 0) {
      return null;
    }
    const total = liste.reduce((somme, p) => somme + p.scoreObtenu, 0);
    return Math.round((total / liste.length) * 10) / 10;
  }
}
