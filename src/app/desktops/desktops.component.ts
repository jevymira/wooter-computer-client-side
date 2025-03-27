import { Component, OnInit, Signal, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-desktops',
  imports: [
    RouterLink
  ],
  templateUrl: './desktops.component.html',
  styleUrl: './desktops.component.scss',
})
export class DesktopsComponent implements OnInit {
  readonly _memory = inject(ROUTER_OUTLET_DATA) as Signal<AbstractControl>;
  public offers: Offer[] = [];

  constructor(private http: HttpClient) {
    effect(() => {
      console.log(this._memory());
    });
  }

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
