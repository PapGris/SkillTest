import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ParcoursService } from '../../../../core/services/parcours.service';
import { EvaluationsService } from '../../../../core/services/evaluations.service';
import { messageErreurApi } from '../../../../core/http-error.util';
import type { ParcoursListItem } from '../../../../core/models/gestion.models';
import type { EvaluationDetail, EvaluationListItem } from '../../../../core/models/quiz.models';

@Component({
  selector: 'app-onglet-parcours',
  imports: [ReactiveFormsModule],
  templateUrl: './onglet-parcours.html',
  styleUrl: './onglet-parcours.scss',
})
export class OngletParcours implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly parcoursService = inject(ParcoursService);
  private readonly evaluationsService = inject(EvaluationsService);

  protected readonly parcours = signal<ParcoursListItem[]>([]);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);

  protected readonly parcoursSelectionne = signal<ParcoursListItem | null>(null);
  protected readonly evaluationsDuParcours = signal<EvaluationListItem[]>([]);
  protected readonly chargementEvaluations = signal(false);

  protected readonly formulaireParcoursOuvert = signal(false);
  protected readonly formulaireEvaluationOuvert = signal(false);
  protected readonly questionOuvertePourEvaluationId = signal<number | null>(null);
  protected readonly envoiEnCours = signal(false);

  protected readonly evaluationDetailleeId = signal<number | null>(null);
  protected readonly detailEvaluation = signal<EvaluationDetail | null>(null);
  protected readonly chargementQuestions = signal(false);

  protected readonly formulaireParcours = this.fb.nonNullable.group({
    titre: ['', Validators.required],
    description: [''],
  });

  protected readonly formulaireEvaluation = this.fb.nonNullable.group({
    titre: ['', Validators.required],
    typeEvaluation: ['Quiz', Validators.required],
  });

  protected readonly formulaireQuestion = this.fb.nonNullable.group({
    enonce: ['', Validators.required],
    points: [1, [Validators.required, Validators.min(1)]],
    reponses: this.fb.array([this.creerReponseGroup(), this.creerReponseGroup()]),
  });

  ngOnInit(): void {
    this.chargerParcours();
  }

  private creerReponseGroup() {
    return this.fb.nonNullable.group({
      texteReponse: ['', Validators.required],
      estCorrecte: [false],
    });
  }

  protected get reponsesFormArray() {
    return this.formulaireQuestion.controls.reponses;
  }

  protected ajouterChoixReponse(): void {
    this.reponsesFormArray.push(this.creerReponseGroup());
  }

  protected retirerChoixReponse(index: number): void {
    if (this.reponsesFormArray.length > 2) {
      this.reponsesFormArray.removeAt(index);
    }
  }

  private chargerParcours(): void {
    this.chargement.set(true);
    this.parcoursService.getTous().subscribe({
      next: (parcours) => {
        this.parcours.set(parcours);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les parcours.');
        this.chargement.set(false);
      },
    });
  }

  protected selectionnerParcours(parcours: ParcoursListItem): void {
    this.parcoursSelectionne.set(parcours);
    this.chargerEvaluations(parcours.id);
  }

  private chargerEvaluations(parcoursId: number): void {
    this.chargementEvaluations.set(true);
    this.evaluationsService.getToutes(parcoursId).subscribe({
      next: (evaluations) => {
        this.evaluationsDuParcours.set(evaluations);
        this.chargementEvaluations.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les evaluations de ce parcours.');
        this.chargementEvaluations.set(false);
      },
    });
  }

  protected retourListeParcours(): void {
    this.parcoursSelectionne.set(null);
    this.evaluationsDuParcours.set([]);
    this.formulaireEvaluationOuvert.set(false);
    this.questionOuvertePourEvaluationId.set(null);
  }

  protected creerParcours(): void {
    if (this.formulaireParcours.invalid) {
      this.formulaireParcours.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaireParcours.getRawValue();
    this.envoiEnCours.set(true);
    this.parcoursService
      .creer({ titre: valeurs.titre, description: valeurs.description || undefined })
      .subscribe({
        next: () => {
          this.envoiEnCours.set(false);
          this.formulaireParcours.reset({ titre: '', description: '' });
          this.formulaireParcoursOuvert.set(false);
          this.chargerParcours();
        },
        error: (err: HttpErrorResponse) => {
          this.envoiEnCours.set(false);
          this.erreur.set(messageErreurApi(err));
        },
      });
  }

  protected supprimerParcours(parcours: ParcoursListItem): void {
    if (!confirm(`Supprimer le parcours "${parcours.titre}" ?`)) {
      return;
    }
    this.parcoursService.supprimer(parcours.id).subscribe({
      next: () => this.chargerParcours(),
      error: (err: HttpErrorResponse) => this.erreur.set(messageErreurApi(err)),
    });
  }

  protected creerEvaluation(): void {
    const parcours = this.parcoursSelectionne();
    if (!parcours || this.formulaireEvaluation.invalid) {
      this.formulaireEvaluation.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaireEvaluation.getRawValue();
    this.envoiEnCours.set(true);
    this.evaluationsService.creer({ parcoursId: parcours.id, ...valeurs }).subscribe({
      next: () => {
        this.envoiEnCours.set(false);
        this.formulaireEvaluation.reset({ titre: '', typeEvaluation: 'Quiz' });
        this.formulaireEvaluationOuvert.set(false);
        this.chargerEvaluations(parcours.id);
      },
      error: (err: HttpErrorResponse) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurApi(err));
      },
    });
  }

  protected supprimerEvaluation(evaluation: EvaluationListItem): void {
    const parcours = this.parcoursSelectionne();
    if (!parcours || !confirm(`Supprimer l'evaluation "${evaluation.titre}" ?`)) {
      return;
    }
    this.evaluationsService.supprimer(evaluation.id).subscribe({
      next: () => this.chargerEvaluations(parcours.id),
      error: (err: HttpErrorResponse) => this.erreur.set(messageErreurApi(err)),
    });
  }

  protected basculerFormulaireQuestion(evaluationId: number): void {
    this.questionOuvertePourEvaluationId.set(
      this.questionOuvertePourEvaluationId() === evaluationId ? null : evaluationId,
    );
    this.formulaireQuestion.reset({ enonce: '', points: 1 });
    while (this.reponsesFormArray.length > 2) {
      this.reponsesFormArray.removeAt(0);
    }
  }

  protected ajouterQuestion(evaluationId: number): void {
    if (this.formulaireQuestion.invalid) {
      this.formulaireQuestion.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaireQuestion.getRawValue();
    if (!valeurs.reponses.some((r) => r.estCorrecte)) {
      this.erreur.set('Au moins une reponse doit etre marquee correcte.');
      return;
    }

    const parcours = this.parcoursSelectionne();
    this.envoiEnCours.set(true);
    this.erreur.set(null);
    this.evaluationsService.ajouterQuestion(evaluationId, valeurs).subscribe({
      next: () => {
        this.envoiEnCours.set(false);
        this.questionOuvertePourEvaluationId.set(null);
        if (parcours) {
          this.chargerEvaluations(parcours.id);
        }
        if (this.evaluationDetailleeId() === evaluationId) {
          this.chargerDetailEvaluation(evaluationId);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurApi(err));
      },
    });
  }

  protected basculerQuestions(evaluationId: number): void {
    if (this.evaluationDetailleeId() === evaluationId) {
      this.evaluationDetailleeId.set(null);
      this.detailEvaluation.set(null);
      return;
    }
    this.evaluationDetailleeId.set(evaluationId);
    this.chargerDetailEvaluation(evaluationId);
  }

  private chargerDetailEvaluation(evaluationId: number): void {
    this.chargementQuestions.set(true);
    this.evaluationsService.getUne(evaluationId).subscribe({
      next: (detail) => {
        this.detailEvaluation.set(detail);
        this.chargementQuestions.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les questions.');
        this.chargementQuestions.set(false);
      },
    });
  }

  protected supprimerQuestion(questionId: number, evaluationId: number): void {
    if (!confirm('Supprimer cette question ?')) {
      return;
    }
    this.evaluationsService.supprimerQuestion(questionId).subscribe({
      next: () => {
        this.chargerDetailEvaluation(evaluationId);
        const parcours = this.parcoursSelectionne();
        if (parcours) {
          this.chargerEvaluations(parcours.id);
        }
      },
      error: (err: HttpErrorResponse) => this.erreur.set(messageErreurApi(err)),
    });
  }
}
