import { Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { OffersComponent } from './offers/offers.component';

export const routes: Routes = [
    { path: "navbar", component: NavBarComponent },
    { path: "offers", component: OffersComponent },
    { path: "offer-items/:id", component: OfferItemComponent},
    { path: "", component: OffersComponent, pathMatch: "full" }
];
