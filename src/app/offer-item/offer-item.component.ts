import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Location } from '@angular/common';

@Component({
  selector: 'app-offer-item',
  imports: [
    RouterLink
  ],
  templateUrl: './offer-item.component.html',
  styleUrl: './offer-item.component.scss'
})
export class OfferItemComponent {
  public offer: Offer | undefined;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private location: Location) {}

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.http.get<Offer>(`${environment.baseUrl}api/Offers/${id}`).subscribe(
      {
        next: result => this.offer = result,
        error: error => console.error(error)
      });
  }

  // Warning: edge case when opened in a new tab, where
  // there is no "history" to go back to.
  goBack(): void {
    this.location.back();
  }
}
