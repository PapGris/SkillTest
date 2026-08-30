import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { MaCompetence, PassageListItem } from '../models/quiz.models';
import type { UtilisateurListItem } from '../models/gestion.models';

@Injectable({ providedIn: 'root' })
export class UtilisateursService {
  private readonly http = inject(HttpClient);

  getTous(): Observable<UtilisateurListItem[]> {
    return this.http.get<UtilisateurListItem[]>(`${API_URL}/utilisateurs`);
  }

  getCompetencesDe(id: number): Observable<MaCompetence[]> {
    return this.http.get<MaCompetence[]>(`${API_URL}/utilisateurs/${id}/competences`);
  }

  getPassagesDe(id: number): Observable<PassageListItem[]> {
    return this.http.get<PassageListItem[]>(`${API_URL}/utilisateurs/${id}/passages`);
  }
}
