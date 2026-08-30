import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { PassageDetail, PassageListItem, ReponseSoumise, ResultatPassage } from '../models/quiz.models';

@Injectable({ providedIn: 'root' })
export class PassagesService {
  private readonly http = inject(HttpClient);

  passer(evaluationId: number, reponses: ReponseSoumise[]): Observable<ResultatPassage> {
    return this.http.post<ResultatPassage>(`${API_URL}/evaluations/${evaluationId}/passages`, { reponses });
  }

  getMesPassages(): Observable<PassageListItem[]> {
    return this.http.get<PassageListItem[]>(`${API_URL}/me/passages`);
  }

  getUnPassage(id: number): Observable<PassageDetail> {
    return this.http.get<PassageDetail>(`${API_URL}/me/passages/${id}`);
  }
}
