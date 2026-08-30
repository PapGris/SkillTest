import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { EvaluationDetail, EvaluationListItem } from '../models/quiz.models';
import type { CreerEvaluationPayload, CreerQuestionPayload } from '../models/gestion.models';

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  private readonly http = inject(HttpClient);

  getToutes(parcoursId?: number): Observable<EvaluationListItem[]> {
    const url = parcoursId ? `${API_URL}/evaluations?parcoursId=${parcoursId}` : `${API_URL}/evaluations`;
    return this.http.get<EvaluationListItem[]>(url);
  }

  getUne(id: number): Observable<EvaluationDetail> {
    return this.http.get<EvaluationDetail>(`${API_URL}/evaluations/${id}`);
  }

  creer(payload: CreerEvaluationPayload): Observable<EvaluationListItem> {
    return this.http.post<EvaluationListItem>(`${API_URL}/evaluations`, payload);
  }

  supprimer(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_URL}/evaluations/${id}`);
  }

  ajouterQuestion(evaluationId: number, payload: CreerQuestionPayload): Observable<unknown> {
    return this.http.post(`${API_URL}/evaluations/${evaluationId}/questions`, payload);
  }

  supprimerQuestion(questionId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_URL}/questions/${questionId}`);
  }
}
