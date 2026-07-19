import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChemicalSearchResult } from '../models/chemical.model';

interface SearchResults {
  chemicals: ChemicalSearchResult[];
  reactions: {
    _id: string;
    reactants: string[];
    reactantNames: string[];
    balancedEquation: string;
    reactionType: string;
  }[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  globalSearch(query: string, limit = 20): Observable<SearchResults> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http
      .get<ApiResponse<SearchResults>>(this.apiUrl, { params })
      .pipe(map(res => res.data));
  }
}
