import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PlanAbonnementComponent } from './plan_abonnement.component';
import { PlanAbonnementFormComponent } from './form/plan_abonnement-form.component';
import { PlanAbonnementService } from './plan_abonnement.service';

import { SharedModule } from 'app/shared/shared.module';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation'; 

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';   // ✅ AJOUT

const planAbonnementRoutes: Route[] = [
  {
    path: '',
    component: PlanAbonnementComponent
  }
];

@NgModule({
  declarations: [
    PlanAbonnementComponent,
    PlanAbonnementFormComponent
  ],
  providers: [PlanAbonnementService],
  imports: [
    RouterModule.forChild(planAbonnementRoutes),

    // ✅ Material — Modules standard
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
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,

    // ✅ AJOUT — SnackBar
    MatSnackBarModule,

    // ✅ Fuse
    FuseNavigationModule,
    FuseAlertModule,
    FuseCardModule,
    FuseScrollbarModule,

    // ✅ Shared
    SharedModule,
  ]
})
export class PlanAbonnementModule { }