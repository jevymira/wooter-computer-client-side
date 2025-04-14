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
    private router: Router) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.memory = (params['memory']) || [];
      this.storage = (params['storage']) || [];
      let page = params['page'] || 0;
      this.getOffers(params = new HttpParams().set('category', this.category)
      .appendAll({'memory' : this.memory, 'storage' : this.storage}));
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: page, memory: this.memory },
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
    this.memory = filters.memory;
    this.storage = filters.storage;
  
    this.memory.forEach(selected => params = params.append('memory', selected));
    this.storage.forEach(selected => params = params.append('storage', selected));

    this.getOffers(params);
    this.pagedOffers = this.offers.slice(0, 12);
    this.length = this.offers.length;

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

  getOffers(params: HttpParams) {
    this.http.get<Offer[]>(`${environment.baseUrl}api/offers`, {params}).subscribe
    (
      {
        next: result => { 
          this.offers = result;
          this.paginateOffers(this.paginator.pageIndex);
        },
        error: error => console.error(error)
      }
    )
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
