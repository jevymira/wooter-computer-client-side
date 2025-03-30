import { Routes } from '@angular/router';
import { DesktopsComponent } from './desktops/desktops.component';
import { LaptopsComponent } from './laptops/laptops.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { OffersComponent } from './offers/offers.component';

export const routes: Routes = [
    { path: "desktops/:category", component: DesktopsComponent },
    { path: "laptops", component: LaptopsComponent },
    { path: "navbar", component: NavBarComponent },
    { path: "offers", component: OffersComponent },
    { path: "offer-items/:id", component: OfferItemComponent},
    { path: "", component: OffersComponent, pathMatch: "full" }
];
