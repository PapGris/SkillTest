import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PassagesService } from '../../../../core/services/passages.service';
import type { PassageListItem } from '../../../../core/models/quiz.models';

@Component({
  selector: 'app-onglet-historique',
  imports: [RouterLink, DatePipe],
  templateUrl: './onglet-historique.html',
  styleUrl: './onglet-historique.scss',
})
export class OngletHistorique implements OnInit {
  private readonly passagesService = inject(PassagesService);

  protected readonly passages = signal<PassageListItem[]>([]);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.passagesService.getMesPassages().subscribe({
      next: (passages) => {
        this.passages.set(passages);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger ton historique.');
        this.chargement.set(false);
      },
    });
  }
}
