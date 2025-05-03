import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Location } from '@angular/common';
import { OfferService } from '../offers/offer.service';
import { AuthService } from '../auth/auth.service';
import { concatMap, EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Bookmark } from '../bookmarks/bookmark';

@Component({
  selector: 'app-offer-item',
  imports: [],
  templateUrl: './offer-item.component.html',
  styleUrl: './offer-item.component.scss'
})
export class OfferItemComponent implements OnInit, OnDestroy {
  offer: Offer | undefined;
  private destroySubject = new Subject();
  isLoggedIn: boolean = false;
  isBookmarked: boolean = false;

  constructor(
    private authService: AuthService,
    private offerService: OfferService,
    private bookmarkService: BookmarksService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    authService.authStatus
      .pipe(takeUntil(this.destroySubject))
      .subscribe(result => this.isLoggedIn = result)
  }

  ngOnInit() {
    // Current getAuthStatus() implementation takes no account of token expiry,
    // rerouting user attempts to navigate to this component.
    /* this.isLoggedIn = this.authService.getAuthStatus(); */
    
    this.offerService.getOffer(this.activatedRoute.snapshot.paramMap.get("id") || '')
      .pipe(
        takeUntil(this.destroySubject),
        concatMap((result) => { // Get offer, first, to determine whether bookmark exists.
          this.offer = result;
          if (this.isLoggedIn) {
            return this.bookmarkService.getBookmarks(result.id)
          }
          else {
            return EMPTY // Prevent 401 Unauthorized error.
          }
        })
      )
      .subscribe(result => this.isBookmarked = (result.length != 0));
  }

  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  // Warning: edge case when opened in a new tab, where
  // there is no "history" to go back to.
  goBack(): void {
    this.location.back();
  }

  bookmark(): void {
    if (this.offer) {
      this.bookmarkService.post(this.offer.id)
        .pipe(takeUntil(this.destroySubject))
        .subscribe({next: result => this.isBookmarked = true});
    }
  }

  removeBookmark(): void {
    if (this.offer) {
      this.bookmarkService.delete(this.offer.id)
        .pipe(takeUntil(this.destroySubject))
        .subscribe({next: result => this.isBookmarked = false});
    }
  }
}
