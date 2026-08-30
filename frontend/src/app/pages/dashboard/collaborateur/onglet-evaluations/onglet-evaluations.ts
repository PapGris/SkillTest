import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EvaluationsService } from '../../../../core/services/evaluations.service';
import type { EvaluationListItem } from '../../../../core/models/quiz.models';

@Component({
  selector: 'app-onglet-evaluations',
  imports: [RouterLink],
  templateUrl: './onglet-evaluations.html',
  styleUrl: './onglet-evaluations.scss',
})
export class OngletEvaluations implements OnInit {
  private readonly evaluationsService = inject(EvaluationsService);

  protected readonly evaluations = signal<EvaluationListItem[]>([]);
  protected readonly chargement = signal(true);
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
}
