import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { StatutService } from './statut.service';
import { StatutFormComponent } from './form/statut-form.component';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'statut',
  templateUrl: './statut.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StatutComponent {
  /**
   * Constructor
   */
  constructor(
    public _dialog: MatDialog,
    private _statutService: StatutService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _adapter: DateAdapter<any>,

  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  public displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
  public statut: StatutService;
  public statutDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;

  public searchText = '';
  public listeStatut: any;

  ngOnInit() {
    this.getListeStatut(); 
  }




  getListeStatut() {
    this.inProgress = true;
    this._statutService.query({ order: { id: 'DESC' }, relations: [], 
    where: {
      geler: 0, 
    }
  }).subscribe(result => {
      this.inProgress = false;
      this.listeStatut = result;
      this.statutDataSource = new MatTableDataSource<any>(this.listeStatut);
      this.statutDataSource.sort = this.sort;
      this.statutDataSource.paginator = this.paginator;
    });
  }




  applyFilter(event?: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.statutDataSource.filter = filterValue.trim().toLowerCase();

    if (this.statutDataSource.paginator) {
      this.statutDataSource.paginator.firstPage();
    }
  }



  openEditModalStatut(statut?: any) {
    const data = statut === undefined ? {} : statut;
    const dialogRef = this._dialog.open(StatutComponent, { width: '800px', disableClose: true, data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListeStatut();
      }
    });
  }



  // openEditStatutForm(statut?: any) {
  //   const data = statut === undefined ? {} : statut;
  //   const dialogRef = this._dialog.open(StatutFormComponent, { width: '800px', disableClose: true, data: data });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getListeStatut();
  //     }
  //   });
  // }

  openEditStatutForm(statut?: any) {
    const data = statut === undefined ? {} : statut;
    const dialogRef = this._dialog.open(StatutFormComponent, { width: '800px', disableClose: true, data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListeStatut();
      }
    });
  }





  deleteStatut(statut): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une statut',
      message: 'Êtes-vous sûr de vouloir supprimer cette statut? Cette action ne peut pas être annulée!',
      icon: {
        show: true,
        name: 'mat_solid:delete_forever',
        color: 'warn',
      },
      actions: {
        confirm: {
          label: 'Supprimer',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'Annuler',
        },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(statut);
      }
    });
  }

  supprimer(statut): void {
    this.inProgress = true;
    this._statutService.deleteStatut(statut).subscribe(result => {
      this.inProgress = false;
      if (result) {
        this.getListeStatut();
      }
    });
  }

}
