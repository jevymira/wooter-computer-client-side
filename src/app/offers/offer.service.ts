import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../offer';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  get(
    category: string = '',
    memory: number[] | [],
    storage: number[] | [],
    page: number = 0
  ): Observable<Offer[]> {
    let url = `${environment.baseUrl}api/offers`
    let params = new HttpParams()
      .set('category', category)
      .set('page', page);

    memory.forEach(m => {
      params = params.append('memory', m);
    });

    storage.forEach(s => {
      params = params.append('storage', s);
    });

    return this.http.get<Offer[]>(url, { params })
  }
}
