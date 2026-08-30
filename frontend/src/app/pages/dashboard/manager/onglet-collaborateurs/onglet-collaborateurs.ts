import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UtilisateursService } from '../../../../core/services/utilisateurs.service';
import type { UtilisateurListItem } from '../../../../core/models/gestion.models';
import type { MaCompetence, PassageListItem } from '../../../../core/models/quiz.models';

@Component({
  selector: 'app-onglet-collaborateurs',
  imports: [DatePipe],
  templateUrl: './onglet-collaborateurs.html',
  styleUrl: './onglet-collaborateurs.scss',
})
export class OngletCollaborateurs implements OnInit {
  private readonly utilisateursService = inject(UtilisateursService);

  protected readonly collaborateurs = signal<UtilisateurListItem[]>([]);
  protected readonly collaborateurSelectionne = signal<UtilisateurListItem | null>(null);
  protected readonly competences = signal<MaCompetence[]>([]);
  protected readonly passages = signal<PassageListItem[]>([]);

  protected readonly chargement = signal(true);
  protected readonly chargementDetail = signal(false);
  protected readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.utilisateursService.getTous().subscribe({
      next: (utilisateurs) => {
        this.collaborateurs.set(utilisateurs.filter((u) => u.role.nomRole === 'Collaborateur'));
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les collaborateurs.');
        this.chargement.set(false);
      },
    });
  }

  protected selectionner(collaborateur: UtilisateurListItem): void {
    this.collaborateurSelectionne.set(collaborateur);
    this.chargementDetail.set(true);
    forkJoin({
      competences: this.utilisateursService.getCompetencesDe(collaborateur.id),
      passages: this.utilisateursService.getPassagesDe(collaborateur.id),
    }).subscribe({
      next: ({ competences, passages }) => {
        this.competences.set(competences);
        this.passages.set(passages);
        this.chargementDetail.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger le detail de ce collaborateur.');
        this.chargementDetail.set(false);
      },
    });
  }

  protected retourListe(): void {
    this.collaborateurSelectionne.set(null);
    this.competences.set([]);
    this.passages.set([]);
  }
}
