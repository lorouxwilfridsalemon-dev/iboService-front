import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ReservationService } from '../../reservation.service';
import { ReservationInterface } from '../../reservation.interface';


@Component({
  selector: 'app-reservation-modal-list.component.ts',
  templateUrl: './reservation-modal-list.component.html',
  styleUrls: ['./reservation-modal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationModalListComponent implements OnInit {

    constructor(
      public _dialogRef: MatDialogRef<ReservationModalListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _reservationService: ReservationService,
    ) { }
	
	@ViewChild(MatPaginator, {}) paginator: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	
    public displayedColumns: string[] = [ 'nom', 'prenoms', 'dateNaissance','action'];
    public reservation: ReservationInterface;
    public reservationDataSource = new MatTableDataSource<any>([]);
    public inProgress = false;

    public searchText = '';
    public listeReservation : ReservationInterface[] = [];

  
    ngOnInit() {
      // this.getListeReservation();
    }
  
    // getListeReservation() {
    //   this.inProgress = true; // Démarre le loader
    //   this._reservationService.query({ order: { id: 'DESC'}, relations:[]}).subscribe(result => {
    //       this.inProgress = false; // stop le loader
    //       this.listeReservation = result;
    //       this.reservationDataSource = new MatTableDataSource<any>(result);
    //       this.reservationDataSource.sort = this.sort;
    //       this.reservationDataSource.paginator = this.paginator;
        
    //   });
      
    // }
  
    // applyFilter(searchText: string) {
    //   this.reservationDataSource.filter = searchText.trim().toLowerCase();
    // }

    // close() {
    //     this._dialogRef.close();
    // }
}
