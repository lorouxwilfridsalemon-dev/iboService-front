import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AbonnementListComponent } from './list/abonnement-list.component';
import { AbonnementModalListComponent } from './modal/list/abonnement-modal-list.component';
import { AbonnementModalFormComponent } from './modal/form/abonnement-modal-form.component';
import { AbonnementService } from './abonnement.service';
import { RouterModule } from '@angular/router';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { abonnementRoutes } from './abonnement.routing';
import { MatTableModule } from '@angular/material/table';
import { AbonnementAdminFormComponent } from './form/abonnement-admin-form.component';
import { AnnonceService } from '../annonce/annonce.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';



@NgModule({
  declarations: [AbonnementListComponent,
    AbonnementAdminFormComponent,
    AbonnementModalListComponent,
    AbonnementModalFormComponent],
  imports: [
    RouterModule.forChild(abonnementRoutes),
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    FuseNavigationModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    SharedModule,
    FuseAlertModule,
    FuseCardModule,
    FuseScrollbarModule,

  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  providers: [AbonnementService,AnnonceService,UtilisateurService],
 
  //  providers: [
  //         AnnonceService,
  //         ReservationService,
  //         CategoriesService,
  //         UtilisateurService,
  //     ]
  
  bootstrap: [],
})
export class AbonnementModule {

}
