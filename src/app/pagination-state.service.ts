import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationStateService {
  pageIndex = 0;
  constructor() { }
}
