import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CompetencesService } from '../../../../core/services/competences.service';
import { messageErreurApi } from '../../../../core/http-error.util';
import type { Competence } from '../../../../core/models/quiz.models';

@Component({
  selector: 'app-onglet-competences',
  imports: [ReactiveFormsModule],
  templateUrl: './onglet-competences.html',
  styleUrl: './onglet-competences.scss',
})
export class OngletCompetences implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly competencesService = inject(CompetencesService);

  protected readonly competences = signal<Competence[]>([]);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);

  protected readonly formulaireOuvert = signal(false);
  protected readonly competenceEnEdition = signal<Competence | null>(null);
  protected readonly envoiEnCours = signal(false);

  protected readonly formulaireCompetence = this.fb.nonNullable.group({
    nomCompetence: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  ngOnInit(): void {
    this.chargerCompetences();
  }

  private chargerCompetences(): void {
    this.chargement.set(true);
    this.competencesService.getToutes().subscribe({
      next: (competences) => {
        this.competences.set(competences);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les competences.');
        this.chargement.set(false);
      },
    });
  }

  protected ouvrirCreation(): void {
    this.competenceEnEdition.set(null);
    this.formulaireCompetence.reset({ nomCompetence: '', description: '' });
    this.formulaireOuvert.set(true);
  }

  protected ouvrirEdition(competence: Competence): void {
    this.competenceEnEdition.set(competence);
    this.formulaireCompetence.reset({
      nomCompetence: competence.nomCompetence,
      description: competence.description || '',
    });
    this.formulaireOuvert.set(true);
  }

  protected annuler(): void {
    this.formulaireOuvert.set(false);
    this.competenceEnEdition.set(null);
  }

  protected enregistrer(): void {
    if (this.formulaireCompetence.invalid) {
      this.formulaireCompetence.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaireCompetence.getRawValue();
    const payload = { nomCompetence: valeurs.nomCompetence, description: valeurs.description || undefined };
    const enEdition = this.competenceEnEdition();

    this.envoiEnCours.set(true);
    this.erreur.set(null);
    const requete = enEdition
      ? this.competencesService.modifier(enEdition.id, payload)
      : this.competencesService.creer(payload);

    requete.subscribe({
      next: () => {
        this.envoiEnCours.set(false);
        this.formulaireOuvert.set(false);
        this.competenceEnEdition.set(null);
        this.chargerCompetences();
      },
      error: (err: HttpErrorResponse) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurApi(err));
      },
    });
  }

  protected supprimer(competence: Competence): void {
    if (!confirm(`Supprimer la competence "${competence.nomCompetence}" ?`)) {
      return;
    }
    this.competencesService.supprimer(competence.id).subscribe({
      next: () => this.chargerCompetences(),
      error: (err: HttpErrorResponse) => this.erreur.set(messageErreurApi(err)),
    });
  }
}
