import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { Competence, MaCompetence } from '../models/quiz.models';

@Injectable({ providedIn: 'root' })
export class CompetencesService {
  private readonly http = inject(HttpClient);

  getToutes(): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${API_URL}/competences`);
  }

  getMesCompetences(): Observable<MaCompetence[]> {
    return this.http.get<MaCompetence[]>(`${API_URL}/me/competences`);
  }

  setNiveau(competenceId: number, niveauEstime: number): Observable<MaCompetence> {
    return this.http.put<MaCompetence>(`${API_URL}/me/competences/${competenceId}`, { niveauEstime });
  }
}
