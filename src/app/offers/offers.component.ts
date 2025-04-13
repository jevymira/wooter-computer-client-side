import { Component, effect, inject, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { PaginationStateService } from '../pagination-state.service';

@Component({
  selector: 'app-offers',
  imports: [
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  readonly _memory = inject(ROUTER_OUTLET_DATA) as Signal<Partial<{ has8: boolean | null; has16: boolean | null; has32: boolean | null; }>>;
  public offers: Offer[] = [];
  pagedOffers: Offer[] = [];
  length: number = 0;
  pageSize: number = 12;
  category: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private paginationService: PaginationStateService)
  {
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
      this.pagedOffers = this.offers.slice(0, 12);
      this.length = this.offers.length;
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.getOffers(params = new HttpParams().set('category', this.category));
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.paginationService.pageIndex = this.paginator.pageIndex;
    });

    // Restore paginator state (e.g., when navigated to with "Back" button)
    this.paginator.pageIndex = this.paginationService.pageIndex;
  }

  // Adapted from answer to "How to use angular-material pagination with mat-card?"
  // at https://stackoverflow.com/a/54308594
  onPageChange(event: PageEvent) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    this.length = this.offers.length;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedOffers = this.offers.slice(startIndex, endIndex);
  }

  getOffers(params: HttpParams) {
    this.http.get<Offer[]>(`${environment.baseUrl}api/offers`, {params}).subscribe
    (
      {
        next: result => { 
          this.offers = result;
          this.length = this.offers.length;
          let startIndex = this.paginator.pageIndex * this.pageSize;
          let endIndex = startIndex + this.pageSize;
          this.length = this.offers.length;
          if (endIndex > this.length) {
            endIndex = this.length;
          }
          this.pagedOffers = this.offers.slice(startIndex, endIndex);
        },
        error: error => console.error(error)
      }
    )
  }
}
