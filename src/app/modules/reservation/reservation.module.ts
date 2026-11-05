import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReservationListComponent } from './list/reservation-list.component';
import { ReservationModalListComponent } from './modal/list/reservation-modal-list.component';
import { ReservationModalFormComponent } from './modal/form/reservation-modal-form.component';
import { ReservationService } from './reservation.service';
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
import { reservationRoutes } from './reservation.routing';
import { MatTableModule } from '@angular/material/table';
import { ReservationAdminFormComponent } from './form/reservation-admin-form.component';
import { AnnonceService } from '../annonce/annonce.service';



@NgModule({
  declarations: [ReservationListComponent,
    ReservationAdminFormComponent,
    ReservationModalListComponent,
    ReservationModalFormComponent],
  imports: [
    RouterModule.forChild(reservationRoutes),
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
  providers: [ReservationService,AnnonceService],
  bootstrap: [],
})
export class ReservationModule {

}
