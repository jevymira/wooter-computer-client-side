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

  getBookmarks(userId: string): Observable<Bookmark[]> {
    let url = `${environment.baseUrl}api/bookmarks/`;
    let params = new HttpParams().set('userId', userId);
    return this.http.get<Bookmark[]>(url, { params });
  }
}
