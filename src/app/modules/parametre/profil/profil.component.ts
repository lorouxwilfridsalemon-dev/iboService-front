import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { ProfilService } from './profil.service';
import { ProfilFormComponent } from './form/profil-form.component';

@Component({
  selector: 'profil',
  templateUrl: './profil.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProfilComponent {
  constructor(
    public _dialog: MatDialog,
    private _profilService: ProfilService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
  public profilDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;

  public searchText = '';
  public listeProfil: any[] = [];
  public total = 0;

  ngOnInit() {
    this.getListeProfil();
  }

  ngAfterViewInit(): void {
    this.profilDataSource.sort = this.sort;
    this.profilDataSource.paginator = this.paginator;
  }

  getListeProfil() {
    this.inProgress = true;
    this._profilService.listeProfils().subscribe({
      next: (result: any) => {
        this.inProgress = false;
        this.listeProfil = result?.data ?? [];
        this.total = this.listeProfil.length;
        this.profilDataSource.data = this.listeProfil;
        this.profilDataSource.sort = this.sort;
        this.profilDataSource.paginator = this.paginator;
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }

  applyFilter(event?: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.profilDataSource.filter = filterValue.trim().toLowerCase();
    if (this.profilDataSource.paginator) {
      this.profilDataSource.paginator.firstPage();
    }
  }

  // ✅ RETIRÉ : openEditModalProfil() supprimé — code mort qui ouvrait
  // ProfilComponent sur lui-même au lieu du formulaire, jamais appelé
  // par le template (qui utilise openEditProfilForm ci-dessous).

  openEditProfilForm(profil?: any) {
    const data = profil === undefined || profil === null ? {} : profil;
    const dialogRef = this._dialog.open(ProfilFormComponent, {
      width: '600px',
      disableClose: true,
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListeProfil();
      }
    });
  } 

  deleteProfil(profil): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer un profil',
      message: 'Êtes-vous sûr de vouloir supprimer ce profil ? Cette action ne peut pas être annulée !',
      icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
      actions: {
        confirm: { label: 'Supprimer', color: 'warn' },
        cancel: { show: true, label: 'Annuler' },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(profil);
      }
    });
  }

  supprimer(profil): void {
    this.inProgress = true;
    this._profilService.supprimerProfil(profil.id).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.getListeProfil();
        }
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }
}