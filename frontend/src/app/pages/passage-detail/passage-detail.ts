import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { PassagesService } from '../../core/services/passages.service';
import type { PassageDetail as PassageDetailModel, ReponseCorrection } from '../../core/models/quiz.models';

@Component({
  selector: 'app-passage-detail',
  imports: [Navbar, RouterLink, DatePipe],
  templateUrl: './passage-detail.html',
  styleUrl: './passage-detail.scss',
})
export class PassageDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly passagesService = inject(PassagesService);

  protected readonly passage = signal<PassageDetailModel | null>(null);
  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.passagesService.getUnPassage(id).subscribe({
      next: (passage) => {
        this.passage.set(passage);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger le detail de cette tentative.');
        this.chargement.set(false);
      },
    });
  }

  protected joindre(reponses: ReponseCorrection[]): string {
    return reponses.map((r) => r.texte).join(', ');
  }
}
