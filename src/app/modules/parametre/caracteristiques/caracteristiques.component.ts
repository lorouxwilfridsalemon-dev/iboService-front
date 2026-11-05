import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CaracteristiquesService } from './caracteristiques.service';
import { CaracteristiquesFormComponent } from './form/caracteristiques-form.component';

@Component({
    selector: 'caracteristiques',
    templateUrl: './caracteristiques.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CaracteristiquesComponent implements OnInit {
    constructor(
        public _dialog: MatDialog,
        private _caracteristiquesService: CaracteristiquesService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public displayedColumns: string[] = ['nom', 'description', 'dateCreation', 'action'];
    public caracteristiquesDataSource = new MatTableDataSource<any>([]);
    public inProgress = false;
    public searchText = '';
    public listeCaracteristiques: any[];

    // ✅ AJOUT : total pour la carte de statistique en en-tête.
    public totalCaracteristiques = 0;

    ngOnInit() {
        this.getListeCaracteristiques();
    }

    ngAfterViewInit(): void {
        this.caracteristiquesDataSource.sort = this.sort;
        this.caracteristiquesDataSource.paginator = this.paginator;
    }

    getListeCaracteristiques() {
        this.inProgress = true;
        this._caracteristiquesService.query({
            order: { id: 'DESC' },
            relations: [],
            where: { geler: 0 }
        }).subscribe({
            next: (result) => {
                this.inProgress = false;
                this.listeCaracteristiques = result;
                this.totalCaracteristiques = result?.length ?? 0;
                this.caracteristiquesDataSource.data = this.listeCaracteristiques;
                this.caracteristiquesDataSource.sort = this.sort;
                this.caracteristiquesDataSource.paginator = this.paginator;
            },
            error: () => {
                this.inProgress = false;
            }
        });
    }

    applyFilter(event?: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.caracteristiquesDataSource.filter = filterValue.trim().toLowerCase();
        if (this.caracteristiquesDataSource.paginator) {
            this.caracteristiquesDataSource.paginator.firstPage();
        }
    }

    openEditCaracteristiquesForm(caracteristiques?: any) {
        const data = caracteristiques === undefined || caracteristiques === null ? {} : caracteristiques;
        const dialogRef = this._dialog.open(CaracteristiquesFormComponent, {
            width: '800px',
            disableClose: true,
            data: data
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getListeCaracteristiques();
            }
        });
    }

    deleteCaracteristiques(caracteristiques): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Supprimer une caractéristique',
            message: 'Êtes-vous sûr de vouloir supprimer cette caractéristique ? Cette action ne peut pas être annulée !',
            icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
            actions: {
                confirm: { label: 'Supprimer', color: 'warn' },
                cancel: { show: true, label: 'Annuler' }
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.supprimer(caracteristiques);
            }
        });
    }

    // ✅ MODIFIÉ : passe par le métier (suppression douce), la route
    // générique renvoyait une erreur 500.
    supprimer(caracteristiques): void {
        this.inProgress = true;
        this._caracteristiquesService.supprimerCaracteristiques(caracteristiques.id).subscribe({
            next: (result) => {
                this.inProgress = false;
                if (result) {
                    this.getListeCaracteristiques();
                }
            },
            error: () => {
                this.inProgress = false;
            }
        });
    }
}