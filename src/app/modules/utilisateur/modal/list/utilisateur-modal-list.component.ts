import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../utilisateur.service';
import { UtilisateurInterface } from '../../utilisateur.interface';


@Component({
  selector: 'app-utilisateur-modal-list.component.ts',
  templateUrl: './utilisateur-modal-list.component.html',
  styleUrls: ['./utilisateur-modal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UtilisateurModalListComponent implements OnInit {

    constructor(
      public _dialogRef: MatDialogRef<UtilisateurModalListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _utilisateurService: UtilisateurService,
    ) { }
	
	@ViewChild(MatPaginator, {}) paginator: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	
    public displayedColumns: string[] = [ 'nom', 'prenoms', 'dateNaissance','action'];
    public utilisateur: UtilisateurInterface;
    public utilisateurDataSource = new MatTableDataSource<any>([]);
    public inProgress = false;

    public searchText = '';
    public listeUtilisateur : UtilisateurInterface[] = [];

  
    ngOnInit() {
      // this.getListeUtilisateur();
    }
  
    // getListeUtilisateur() {
    //   this.inProgress = true; // Démarre le loader
    //   this._utilisateurService.query({ order: { id: 'DESC'}, relations:[]}).subscribe(result => {
    //       this.inProgress = false; // stop le loader
    //       this.listeUtilisateur = result;
    //       this.utilisateurDataSource = new MatTableDataSource<any>(result);
    //       this.utilisateurDataSource.sort = this.sort;
    //       this.utilisateurDataSource.paginator = this.paginator;
        
    //   });
      
    // }
  
    // applyFilter(searchText: string) {
    //   this.utilisateurDataSource.filter = searchText.trim().toLowerCase();
    // }

    // close() {
    //     this._dialogRef.close();
    // }
}
