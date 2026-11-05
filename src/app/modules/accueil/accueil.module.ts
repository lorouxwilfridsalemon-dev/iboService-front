// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// // ✅ CORRIGÉ : le chemin correct est '@angular/material/icon', pas
// // '@angular/material/icon/icon-module' (qui n'existe pas dans les
// // versions récentes d'Angular Material).
// import { MatIconModule } from '@angular/material/icon';
// import { Route, RouterModule } from '@angular/router';
// import { AccueilComponent } from 'app/modules/accueil/accueil.component';

// const accueilRoutes: Route[] = [
//     {
//         path     : '',
//         component: AccueilComponent
//     }
// ];

// @NgModule({
//     declarations: [
//         AccueilComponent,
//     ],
//     imports     : [
//         // ✅ AJOUT : indispensable pour *ngFor, *ngIf, [ngClass]...
//         CommonModule,
//         RouterModule.forChild(accueilRoutes),
//         MatIconModule,
//     ]
// })
// export class AccueilModule
// {
// }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Route, RouterModule } from '@angular/router';
import { AccueilComponent } from 'app/modules/accueil/accueil.component';

// ✅ IMPORTEZ VOS SERVICES
import { AnnonceService } from '../annonce/annonce.service';
import { ReservationService } from '../reservation/reservation.service';
import { CategoriesService } from '../parametre/categories/categories.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';

const accueilRoutes: Route[] = [
    {
        path     : '',
        component: AccueilComponent
    }
];

@NgModule({
    declarations: [
        AccueilComponent,
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(accueilRoutes),
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
    ],
    // ✅ AJOUTEZ LES SERVICES ICI
    providers: [
        AnnonceService,
        ReservationService,
        CategoriesService,
        UtilisateurService,
    ]
})
export class AccueilModule { } 