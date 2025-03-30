import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-offers',
  imports: [RouterLink],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  readonly _memory = inject(ROUTER_OUTLET_DATA) as Signal<Partial<{ has8: boolean | null; has16: boolean | null; has32: boolean | null; }>>;
  public offers: Offer[] = [];
  category: string = '';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    effect(() => {
      let category = this.category;
      let params = new HttpParams();
      if (category != '') {
        params = new HttpParams().set('category', category)
      }

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

      this.getOffers(params);
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.getOffers(params = new HttpParams().set('category', this.category));
    });
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
