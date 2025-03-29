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
  readonly _memory = inject(ROUTER_OUTLET_DATA) as Signal<Partial<{ has8: boolean | null; has16: boolean | null; has32: boolean | null; }>>;
  public offers: Offer[] = [];
  // param = new HttpParams().set('category', 'Desktops');

  constructor(private http: HttpClient) {
    effect(() => {
      let params = new HttpParams().set('category', 'Desktops')

      // FIXME: Scope out a more extensible way of handling
      // FormGroup value changes.
      if (this._memory().has8) {
        params = params.append('memory', '8');
      }
      if (this._memory().has16) {
        params = params.append('memory', '16');
      }
      if (this._memory().has32) {
        params = params.append('memory', '32');
      }

      // When no filter is selected, 
      // default to retrieving all offer items.
      if (!(params.has('memory'))) {
        params = params.append('memory', '8');
        params = params.append('memory', '16');
        params = params.append('memory', '32');
      }

      this.getOffers(params);
    });
  }

  ngOnInit() {
    this.getOffers(new HttpParams().set('category', 'Desktops'));
  }

  getOffers(params: HttpParams) {
    this.http.get<Offer[]>(`${environment.baseUrl}api/offers`, {params}).subscribe
    (
      {
        next: result => this.offers = result,
        error: error => console.error(error)
      }
    )
  }
}
