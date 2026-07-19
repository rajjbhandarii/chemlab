import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ReactionResult, PopularReaction } from '../models/reaction.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private readonly apiUrl = `${environment.apiUrl}/reactions`;

  constructor(private http: HttpClient) {}

  simulate(reactants: string[]): Observable<ReactionResult> {
    return this.http
      .post<ApiResponse<ReactionResult>>(`${this.apiUrl}/simulate`, { reactants })
      .pipe(map(res => res.data));
  }

  getPopular(): Observable<PopularReaction[]> {
    return this.http
      .get<ApiResponse<PopularReaction[]>>(`${this.apiUrl}/popular`)
      .pipe(map(res => res.data));
  }
}
