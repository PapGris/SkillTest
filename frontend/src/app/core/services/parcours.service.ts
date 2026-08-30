import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { CreerParcoursPayload, ParcoursListItem } from '../models/gestion.models';

@Injectable({ providedIn: 'root' })
export class ParcoursService {
  private readonly http = inject(HttpClient);

  getTous(): Observable<ParcoursListItem[]> {
    return this.http.get<ParcoursListItem[]>(`${API_URL}/parcours`);
  }

  creer(payload: CreerParcoursPayload): Observable<ParcoursListItem> {
    return this.http.post<ParcoursListItem>(`${API_URL}/parcours`, payload);
  }

  supprimer(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_URL}/parcours/${id}`);
  }
}
