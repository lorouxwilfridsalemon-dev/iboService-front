import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StatutComponent } from './statut.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StatutService } from './statut.service';
import { StatutFormComponent } from './form/statut-form.component';

const statutRoutes: Route[] = [
    {
        path     : '',
        component: StatutComponent
    }
];

@NgModule({
    declarations: [
        StatutFormComponent,
        StatutComponent
    ],
    providers: [StatutService],

    imports     : [
        RouterModule.forChild(statutRoutes),
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
    ]
})
export class StatutModule
{
}
