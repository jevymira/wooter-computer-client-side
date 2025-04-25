import { Component, OnInit } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './bookmark';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

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
  bookmarks: Bookmark[] = [];

  constructor(private service: BookmarksService) { }

  ngOnInit(): void {
    this.service.getBookmarks("1")
      .subscribe({
        next: result => this.bookmarks = result,
        error: error => console.error(error)
      });
  }
}
