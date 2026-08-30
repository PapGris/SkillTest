import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CompetencesService } from '../../../../core/services/competences.service';
import type { Competence, MaCompetence } from '../../../../core/models/quiz.models';

interface LigneCompetence {
  id: number;
  nomCompetence: string;
  description: string | null;
  niveauEnregistre: number | null;
  niveauChoisi: number;
}

@Component({
  selector: 'app-onglet-competences',
  imports: [FormsModule],
  templateUrl: './onglet-competences.html',
  styleUrl: './onglet-competences.scss',
})
export class OngletCompetences implements OnInit {
  private readonly competencesService = inject(CompetencesService);

  protected readonly lignes = signal<LigneCompetence[]>([]);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly ligneEnCoursId = signal<number | null>(null);
  protected readonly ligneEnregistreeId = signal<number | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    forkJoin({
      toutes: this.competencesService.getToutes(),
      miennes: this.competencesService.getMesCompetences(),
    }).subscribe({
      next: ({ toutes, miennes }: { toutes: Competence[]; miennes: MaCompetence[] }) => {
        const niveauxParId = new Map(miennes.map((m) => [m.competenceId, m.niveauEstime]));
        this.lignes.set(
          toutes.map((competence) => ({
            id: competence.id,
            nomCompetence: competence.nomCompetence,
            description: competence.description,
            niveauEnregistre: niveauxParId.get(competence.id) ?? null,
            niveauChoisi: niveauxParId.get(competence.id) ?? 3,
          })),
        );
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger tes competences.');
        this.chargement.set(false);
      },
    });
  }

  enregistrer(ligne: LigneCompetence): void {
    this.ligneEnCoursId.set(ligne.id);
    this.competencesService.setNiveau(ligne.id, ligne.niveauChoisi).subscribe({
      next: () => {
        this.lignes.update((liste) =>
          liste.map((l) => (l.id === ligne.id ? { ...l, niveauEnregistre: ligne.niveauChoisi } : l)),
        );
        this.ligneEnCoursId.set(null);
        this.ligneEnregistreeId.set(ligne.id);
        setTimeout(() => {
          if (this.ligneEnregistreeId() === ligne.id) {
            this.ligneEnregistreeId.set(null);
          }
        }, 2000);
      },
      error: () => {
        this.ligneEnCoursId.set(null);
        this.erreur.set("L'enregistrement a echoue, reessaie.");
      },
    });
  }
}
