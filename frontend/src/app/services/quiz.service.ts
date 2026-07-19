import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Quiz, QuizCount } from '../models/quiz.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly apiUrl = `${environment.apiUrl}/quizzes`;

  constructor(private http: HttpClient) {}

  getQuizzes(difficulty?: string, topic?: string, limit = 10): Observable<Quiz[]> {
    let params = new HttpParams().set('limit', limit.toString());

    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }
    if (topic) {
      params = params.set('topic', topic);
    }

    return this.http
      .get<ApiResponse<Quiz[]>>(this.apiUrl, { params })
      .pipe(map(res => res.data));
  }

  getTopics(): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.apiUrl}/topics`)
      .pipe(map(res => res.data));
  }

  getCount(): Observable<QuizCount> {
    return this.http
      .get<ApiResponse<QuizCount>>(`${this.apiUrl}/count`)
      .pipe(map(res => res.data));
  }
}
