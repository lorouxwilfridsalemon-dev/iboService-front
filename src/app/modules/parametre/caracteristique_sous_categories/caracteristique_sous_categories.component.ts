import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CaracteristiqueSousCategoriesService } from './caracteristique_sous_categories.service';
import { CaracteristiqueSousCategoriesFormComponent } from './form/caracteristique_sous_categories-form.component';

@Component({
    selector: 'caracteristique_sous_categories',
    templateUrl: './caracteristique_sous_categories.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CaracteristiqueSousCategoriesComponent implements OnInit {
    constructor(
        public _dialog: MatDialog,
        private _service: CaracteristiqueSousCategoriesService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Affiche les DEUX côtés de la liaison — pas 'nom'/'description'
    // (qui n'existent pas sur cette entité pivot).
    public displayedColumns: string[] = ['caracteristique', 'sousCategorie', 'dateCreation', 'action'];
    public dataSource = new MatTableDataSource<any>([]);
    public inProgress = false;
    public liste: any[] = [];
    public total = 0;

    ngOnInit() {
        this.charger();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    charger() {
        this.inProgress = true;
        this._service.findAll().subscribe({
            next: (result: any) => {
                this.inProgress = false;
                this.liste = result?.data ?? [];
                this.total = this.liste.length;
                this.dataSource.data = this.liste;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            },
            error: () => {
                this.inProgress = false;
            }
        });
    }

    applyFilter(event?: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ouvrirFormulaire() {
        const dialogRef = this._dialog.open(CaracteristiqueSousCategoriesFormComponent, {
            width: '600px',
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.charger();
            }
        });
    }

    supprimer(element): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Supprimer cette association',
            message: `Retirer « ${element?.caracteristique?.nom} » de « ${element?.sousCategorie?.nom} » ?`,
            icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
            actions: {
                confirm: { label: 'Supprimer', color: 'warn' },
                cancel: { show: true, label: 'Annuler' }
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.inProgress = true;
                this._service.supprimer(element.id).subscribe({
                    next: (res) => {
                        this.inProgress = false;
                        if (res) {
                            this.charger();
                        }
                    },
                    error: () => {
                        this.inProgress = false;
                    }
                });
            }
        });
    }
}