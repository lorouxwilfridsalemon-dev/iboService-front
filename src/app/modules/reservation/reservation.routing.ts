import { Route } from '@angular/router';
import { ReservationListComponent } from './list/reservation-list.component';

export const reservationRoutes: Route[] = [

    {
        path     : '',
        component: ReservationListComponent
    }

];