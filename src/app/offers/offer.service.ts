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

  getOffers(
    category: string = '',
    memory: number[] | [],
    storage: number[] | [],
    page: number = 0
  ): Observable<Offer[]> {
    let url = `${environment.baseUrl}api/offers`
    let params = new HttpParams()
      .set('category', category)
      .set('page', page);

    if (Array.isArray(memory)) {
      memory.forEach(m => {
        params = params.append('memory', m);
      });
    } else {
      params = params.set('memory', memory)
    }

    if (Array.isArray(storage)) {
      storage.forEach(s => {
        params = params.append('storage', s);
      });
    } else {
      params = params.set('storage', storage)
    }

    return this.http.get<Offer[]>(url, { params })
  }

  getOffer(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${environment.baseUrl}api/offers/${id}`);
  }
}
