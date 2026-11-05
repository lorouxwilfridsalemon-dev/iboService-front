import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { AnnonceCaracteristiquesService } from './annonce-caracteristiques.service';
import { AnnonceCaracteristiquesFormComponent } from './form/annonce-caracteristiques-form.component';

@Component({
  selector: 'annonce-caracteristiques',
  templateUrl: './annonce-caracteristiques.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AnnonceCaracteristiquesComponent {
  constructor(
    public _dialog: MatDialog,
    private _service: AnnonceCaracteristiquesService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // ✅ CORRIGÉ : 'valeur' au lieu de 'libelle'
  public displayedColumns: string[] = ['valeur', 'dateCreation', 'action'];
  public dataSource = new MatTableDataSource<any>([]);
  public inProgress = false;
  public liste: any[];

  ngOnInit() {
    this.getListe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getListe() {
    this.inProgress = true;
    this._service.query({
      order: { id: 'DESC' },
      relations: ['caracteristique', 'annonce'],
      where: { geler: 0 }
    }).subscribe({
      next: (result) => {
        this.inProgress = false;
        this.liste = result;
        this.dataSource.data = this.liste;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.inProgress = false
    });
  }

  applyFilter(event?: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditForm(data?: any) {
    const dialogRef = this._dialog.open(AnnonceCaracteristiquesFormComponent, {
      width: '800px',
      disableClose: true,
      data: data || {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getListe();
    });
  }

  delete(data): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une caractéristique d\'annonce',
      message: 'Êtes-vous sûr de vouloir supprimer cette association ?',
      icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
      actions: {
        confirm: { label: 'Supprimer', color: 'warn' },
        cancel: { show: true, label: 'Annuler' }
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(data);
      }
    });
  }

  supprimer(data): void {
    this.inProgress = true;
    // ✅ UTILISE delete() avec l'ID
    this._service.delete(data.id).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) this.getListe();
      },
      error: () => this.inProgress = false
    });
  }
}