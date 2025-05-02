import { Component, effect, inject, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { OfferService } from './offer.service';
import { combineLatestWith, map } from 'rxjs';

@Component({
  selector: 'app-offers',
  imports: [
    RouterLink,
    MatSidenavModule,
    SideBarComponent,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  public offers: Offer[] = [];
  pagedOffers: Offer[] = [];
  length: number = 0;
  pageSize: number = 12;
  category: string = '';
  memory: number[] = [];
  storage: number[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: OfferService) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe( // Combine to prevent multiple calls on category switch.
        combineLatestWith(this.activatedRoute.queryParamMap),
        map(([params, queryParams]) => ({
          category: params.get('category'),
          memory: queryParams.getAll('memory'),
          storage: queryParams.getAll('storage'),
          page: queryParams.get('page')
        }))
      )
      .subscribe(({category, memory, storage, page}) => {
        this.category = category || '';
        this.memory = memory.map(Number) || [];
        this.storage = storage.map(Number) || [];
        let pg = Number(page) || 0;

        this.service.getOffers(this.category, this.memory, this.storage, pg)
        .subscribe({
          next: result => {
            this.offers = result;
            this.paginateOffers(this.paginator.pageIndex)
          }
        });
  
        this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: page, memory: this.memory, storage: this.storage },
        queryParamsHandling: 'merge',
      });
    });
  }

  // Called when navigated to with, e.g., offer-item-component "Back" button.
  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let page = params['page'] || 0;
      this.paginator.pageIndex = page;
    });
  }

  onPageChange(event: PageEvent) {
    this.paginateOffers(event.pageIndex);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,        // keep route
      queryParams: { page: event.pageIndex }, // update query param
      queryParamsHandling: 'merge',
    });
  }

  // Append parameters for memory in the request, then paginate the response.
  onFiltersChange(filters: {memory: number[]; storage: number[]}) {
    let params = new HttpParams();
  
    filters.memory.forEach(selected => params = params.append('memory', selected));
    filters.storage.forEach(selected => params = params.append('storage', selected));

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { 
        page: 0,
        memory: params.getAll('memory'),
        storage: params.getAll('storage'),
      },
      queryParamsHandling: 'merge',
    });
  }

  // Adapted from answer to "How to use angular-material pagination with mat-card?"
  // at https://stackoverflow.com/a/54308594
  private paginateOffers(pageIndex: number) {
    let startIndex = pageIndex * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    this.length = this.offers.length;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedOffers = this.offers.slice(startIndex, endIndex);
  }
}
