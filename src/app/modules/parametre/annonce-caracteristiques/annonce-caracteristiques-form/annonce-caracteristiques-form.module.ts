import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { AnnonceCaracteristiquesFormComponent } from './annonce-caracteristiques-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuillModule } from 'ngx-quill';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

const routes = [
  {
    path: 'type-projet-form/:id',
    component: AnnonceCaracteristiquesFormComponent, 
  },
];



@NgModule({
  declarations: [
    AnnonceCaracteristiquesFormComponent
  ],

    
  imports: [
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,  
    MatNativeDateModule , 
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
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatGridListModule,
    MatToolbarModule,
    MatTooltipModule,
    QuillModule,
    // QRCodeModule,
    MatProgressSpinnerModule


    
    
  ],

})
export class AnnonceCaracteristiquesFormModule 
{}
