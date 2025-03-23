import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-desktops',
  imports: [
    RouterLink
  ],
  templateUrl: './desktops.component.html',
  styleUrl: './desktops.component.scss'
})
export class DesktopsComponent implements OnInit {
  public offers: Offer[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getOffers();
  }

  getOffers() {
    const params = new HttpParams().set(`category`, `Desktops`);
    this.http.get<Offer[]>(`${environment.baseUrl}api/offers`, {params}).subscribe
    (
      {
        next: result => this.offers = result,
        error: error => console.error(error)
      }
    )
  }
}
