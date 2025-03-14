import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { DesktopsComponent } from './desktops/desktops.component';
import { LaptopsComponent } from './laptops/laptops.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

export const routes: Routes = [
    { path: "weather", component: WeatherComponent },
    { path: "desktops", component: DesktopsComponent },
    { path: "laptops", component: LaptopsComponent },
    { path: "navbar", component: NavBarComponent },
    { path: "", component: WeatherComponent, pathMatch: "full" }
];
