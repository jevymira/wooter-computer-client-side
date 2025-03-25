import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-laptops',
  imports: [
    RouterLink
  ],
  templateUrl: './laptops.component.html',
  styleUrl: './laptops.component.scss'
})
export class LaptopsComponent {
  public offers: Offer[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getOffers();
  }

  getOffers() {
    const params = new HttpParams().set(`category`, `Laptops`);
    this.http.get<Offer[]>(`${environment.baseUrl}api/offers`, {params}).subscribe
    (
      {
        next: result => this.offers = result,
        error: error => console.error(error)
      }
    )
  }
}
