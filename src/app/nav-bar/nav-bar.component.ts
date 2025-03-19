import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
 
 @Component({
   selector: 'app-nav-bar',
   imports: [
     RouterLink,
     MatToolbarModule,
     MatIconModule
   ],
   templateUrl: './nav-bar.component.html',
   styleUrl: './nav-bar.component.scss'
 })
 export class NavBarComponent {
 
 }