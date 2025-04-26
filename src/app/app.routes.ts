import { Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { OffersComponent } from './offers/offers.component';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "navbar", component: NavBarComponent },
    { path: "offers/:category", component: OffersComponent },
    { path: "offers/:category/:id", component: OfferItemComponent},
    { path: "", redirectTo: "offers", pathMatch: "full" }
];
