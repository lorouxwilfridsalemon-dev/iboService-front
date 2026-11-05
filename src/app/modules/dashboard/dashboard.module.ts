// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Route, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// // ✅ AJOUT : nécessaires pour le sélecteur de plage de dates.
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// // ✅ MODIFIÉ : MatRadioModule retiré (radio remplacé par des onglets
// // simples), MatTooltipModule ajouté (infobulle sur le bouton réinitialiser).
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatSelectModule } from '@angular/material/select';
// import { DashboardComponent } from './dashboard.component';
// import { DashboardService } from './dashboard.service';
// import { MatPaginatorModule } from '@angular/material/paginator';

// const dashboardRoutes: Route[] = [
//   {
//     path: '',
//     component: DashboardComponent,
//   },
// ];

// @NgModule({
//   declarations: [
//     DashboardComponent,
//   ],
//   imports: [
//     CommonModule,
//     FormsModule, // ✅ AJOUT : nécessaire pour [(ngModel)] sur les dates
//     RouterModule.forChild(dashboardRoutes),
//     MatIconModule,
//     MatButtonModule,
//     MatProgressBarModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatSelectModule,
//     MatTooltipModule,
//     MatPaginatorModule
//   ],
//   providers: [
//     DashboardService,
//   ],
// })
// export class DashboardModule {} 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
// ✅ AJOUT : MAT_DATE_LOCALE — sans lui, le datepicker affiche les dates
// au format américain (M/D/YYYY, ex: "8/13/2026") au lieu du format
// français attendu (DD/MM/YYYY, ex: "13/08/2026").
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(dashboardRoutes),
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  providers: [
    DashboardService,
    // ✅ AJOUT : force le format de date français partout dans ce module.
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ], 
})
export class DashboardModule {}