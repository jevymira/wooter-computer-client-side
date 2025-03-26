import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-desktops',
  imports: [
    RouterLink,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './desktops.component.html',
  styleUrl: './desktops.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopsComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  readonly _memory = this._formBuilder.group({
    8: false,
    16: false,
    32: false
  });

  public offers: Offer[] = [];

  constructor(private http: HttpClient) {}

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
