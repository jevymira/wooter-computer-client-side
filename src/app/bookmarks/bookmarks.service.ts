import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bookmark } from './bookmark';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  constructor(private http: HttpClient) { }

  getBookmarks(offerItemId: number | null): Observable<Bookmark[]> {
    let url = `${environment.baseUrl}api/bookmarks`;
    let params = new HttpParams();
    if (offerItemId) {
      params = params.set('offerItemId', offerItemId);
    }
    return this.http.get<Bookmark[]>(url, {params});
  }

  post(offerItemId: number): Observable<Bookmark> {
    let url = `${environment.baseUrl}api/bookmarks`;
    return this.http.post<Bookmark>(url, {}, {
      params: {
        offerItemId: offerItemId
      }
    });
  }

  delete(offerItemId: number): Observable<void> {
    let url = `${environment.baseUrl}api/bookmarks`;
    let params = new HttpParams().set('offerItemId', offerItemId);
    return this.http.delete<void>(url, {params});
  }
}
