import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import type { EvaluationDetail, EvaluationListItem } from '../models/quiz.models';

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  private readonly http = inject(HttpClient);

  getToutes(): Observable<EvaluationListItem[]> {
    return this.http.get<EvaluationListItem[]>(`${API_URL}/evaluations`);
  }

  getUne(id: number): Observable<EvaluationDetail> {
    return this.http.get<EvaluationDetail>(`${API_URL}/evaluations/${id}`);
  }
}
