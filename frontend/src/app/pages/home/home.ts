import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/auth/auth.service';

interface SegmentRoue {
  label: string;
  couleur: string;
  icone: 'code' | 'serveur' | 'bouclier' | 'nuage' | 'engrenage' | 'graphique';
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly authService = inject(AuthService);

  protected readonly segments: SegmentRoue[] = [
    { label: 'Front-end', couleur: '#22c55e', icone: 'code' },
    { label: 'Sécurité', couleur: '#ef4444', icone: 'bouclier' },
    { label: 'Cloud', couleur: '#ec4899', icone: 'nuage' },
    { label: 'DevOps', couleur: '#3b82f6', icone: 'engrenage' },
    { label: 'Data', couleur: '#14b8a6', icone: 'graphique' },
    { label: 'Back-end', couleur: '#f59e0b', icone: 'serveur' },
  ];

  private readonly angleParSegment = 360 / this.segments.length;

  protected angleSegment(index: number): number {
    return index * this.angleParSegment + this.angleParSegment / 2;
  }

  protected conicGradient(): string {
    const parts = this.segments.map(
      (segment, index) =>
        `${segment.couleur} ${index * this.angleParSegment}deg ${(index + 1) * this.angleParSegment}deg`,
    );
    return `conic-gradient(${parts.join(', ')})`;
  }
}
