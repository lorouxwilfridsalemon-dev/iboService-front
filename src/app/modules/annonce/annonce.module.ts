import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnnonceService } from './annonce.service';
import { RouterModule } from '@angular/router';
import { annonceRoutes } from './annonce.routing';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';   // ✅ AJOUT
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { AnnonceListComponent } from './list/annonce-list.component';
import { AnnonceFormComponent } from './form/annonce-form.component';
import { AnnonceModalListComponent } from './modal/list/annonce-modal-list.component';
import { AnnonceModalFormComponent } from './modal/form/annonce-modal-form.component';
import { SousCategoriesService } from '../parametre/sous-categories/sous-categories.service';
import { CaracteristiquesService } from '../parametre/caracteristiques/caracteristiques.service';

@NgModule({
  declarations: [
    AnnonceListComponent,
    AnnonceFormComponent,
    AnnonceModalListComponent,
    AnnonceModalFormComponent,
  ],
  imports: [
    RouterModule.forChild(annonceRoutes),
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
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSnackBarModule,           // ✅ AJOUT ICI
    FuseNavigationModule,
    MatMenuModule,
    MatSidenavModule,
    SharedModule,
    FuseAlertModule,
    FuseCardModule,
    FuseScrollbarModule,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AnnonceService,
    SousCategoriesService,
    CaracteristiquesService,
  ],
})
export class AnnonceModule {} 
