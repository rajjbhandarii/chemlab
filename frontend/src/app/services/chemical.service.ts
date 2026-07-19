import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Chemical,
  ChemicalListItem,
  ChemicalListResponse,
  ChemicalSearchResult,
  CategoryCount,
  StatsResponse
} from '../models/chemical.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ChemicalService {
  private readonly apiUrl = `${environment.apiUrl}/chemicals`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 50, category?: string): Observable<ChemicalListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (category) {
      params = params.set('category', category);
    }

    return this.http
      .get<ApiResponse<ChemicalListResponse>>(this.apiUrl, { params })
      .pipe(map(res => res.data));
  }

  getById(id: string): Observable<Chemical> {
    return this.http
      .get<ApiResponse<Chemical>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  search(query: string, limit = 20): Observable<ChemicalSearchResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http
      .get<ApiResponse<ChemicalSearchResult[]>>(`${this.apiUrl}/search`, { params })
      .pipe(map(res => res.data));
  }

  getCategories(): Observable<CategoryCount[]> {
    return this.http
      .get<ApiResponse<CategoryCount[]>>(`${this.apiUrl}/categories/list`)
      .pipe(map(res => res.data));
  }

  getStats(): Observable<StatsResponse> {
    return this.http
      .get<ApiResponse<StatsResponse>>(`${environment.apiUrl}/stats`)
      .pipe(map(res => res.data));
  }
}
