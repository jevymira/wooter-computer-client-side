import { Component, OnInit } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './bookmark';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bookmarks',
  imports: [
    MatGridListModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit{
  private destroySubject = new Subject();
  isLoggedIn: boolean = false;
  bookmarks: Bookmark[] = [];

  constructor(
    private authService: AuthService,
    private service: BookmarksService,
    private router: Router) {
    authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(
      result => this.isLoggedIn = result
    )
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    this.service.getBookmarks(null)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: result => this.bookmarks = result,
        error: error => console.error(error)
      });
  }

  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
