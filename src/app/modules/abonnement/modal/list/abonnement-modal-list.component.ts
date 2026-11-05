import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AbonnementService } from '../../abonnement.service';
import { AbonnementInterface } from '../../abonnement.interface';


@Component({
  selector: 'app-abonnement-modal-list.component.ts',
  templateUrl: './abonnement-modal-list.component.html',
  styleUrls: ['./abonnement-modal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbonnementModalListComponent implements OnInit {

    constructor(
      public _dialogRef: MatDialogRef<AbonnementModalListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _abonnementService: AbonnementService,
    ) { }
	
	@ViewChild(MatPaginator, {}) paginator: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	
    public displayedColumns: string[] = [ 'nom', 'prenoms', 'dateNaissance','action'];
    public abonnement: AbonnementInterface;
    public abonnementDataSource = new MatTableDataSource<any>([]);
    public inProgress = false;

    public searchText = '';
    public listeAbonnement : AbonnementInterface[] = [];

  
    ngOnInit() {
      // this.getListeAbonnement();
    }
  
    // getListeAbonnement() {
    //   this.inProgress = true; // Démarre le loader
    //   this._abonnementService.query({ order: { id: 'DESC'}, relations:[]}).subscribe(result => {
    //       this.inProgress = false; // stop le loader
    //       this.listeAbonnement = result;
    //       this.abonnementDataSource = new MatTableDataSource<any>(result);
    //       this.abonnementDataSource.sort = this.sort;
    //       this.abonnementDataSource.paginator = this.paginator;
        
    //   });
      
    // }
  
    // applyFilter(searchText: string) {
    //   this.abonnementDataSource.filter = searchText.trim().toLowerCase();
    // }

    // close() {
    //     this._dialogRef.close();
    // }
}
