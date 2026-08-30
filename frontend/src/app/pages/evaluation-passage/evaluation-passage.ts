import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Navbar } from '../../shared/navbar/navbar';
import { EvaluationsService } from '../../core/services/evaluations.service';
import { PassagesService } from '../../core/services/passages.service';
import { messageErreurApi } from '../../core/http-error.util';
import type { EvaluationDetail, ReponseSoumise, ResultatPassage } from '../../core/models/quiz.models';

@Component({
  selector: 'app-evaluation-passage',
  imports: [Navbar, RouterLink],
  templateUrl: './evaluation-passage.html',
  styleUrl: './evaluation-passage.scss',
})
export class EvaluationPassage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly evaluationsService = inject(EvaluationsService);
  private readonly passagesService = inject(PassagesService);

  private readonly evaluationId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly evaluation = signal<EvaluationDetail | null>(null);
  protected readonly reponsesChoisies = signal<Record<number, number[]>>({});
  protected readonly resultat = signal<ResultatPassage | null>(null);

  protected readonly chargement = signal(true);
  protected readonly envoiEnCours = signal(false);
  protected readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.evaluationsService.getUne(this.evaluationId).subscribe({
      next: (evaluation) => {
        this.evaluation.set(evaluation);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set("Impossible de charger cette evaluation.");
        this.chargement.set(false);
      },
    });
  }

  protected estCochee(questionId: number, reponseId: number): boolean {
    return (this.reponsesChoisies()[questionId] ?? []).includes(reponseId);
  }

  protected basculerReponse(questionId: number, reponseId: number): void {
    this.reponsesChoisies.update((map) => {
      const courant = new Set(map[questionId] ?? []);
      if (courant.has(reponseId)) {
        courant.delete(reponseId);
      } else {
        courant.add(reponseId);
      }
      return { ...map, [questionId]: Array.from(courant) };
    });
  }

  protected optionsDe(questionId: number) {
    return this.evaluation()?.questions.find((q) => q.id === questionId)?.reponses ?? [];
  }

  protected estBonneReponse(question: ResultatPassage['detail'][number], optionId: number): boolean {
    return question.reponsesCorrectes.some((r) => r.id === optionId);
  }

  protected estReponseChoisie(question: ResultatPassage['detail'][number], optionId: number): boolean {
    return question.reponsesChoisies.some((r) => r.id === optionId);
  }

  protected soumettre(): void {
    const evaluation = this.evaluation();
    if (!evaluation) {
      return;
    }

    const reponses: ReponseSoumise[] = evaluation.questions.map((question) => ({
      questionId: question.id,
      reponseIds: this.reponsesChoisies()[question.id] ?? [],
    }));

    this.envoiEnCours.set(true);
    this.erreur.set(null);
    this.passagesService.passer(this.evaluationId, reponses).subscribe({
      next: (resultat) => {
        this.resultat.set(resultat);
        this.envoiEnCours.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurApi(err));
      },
    });
  }
}
