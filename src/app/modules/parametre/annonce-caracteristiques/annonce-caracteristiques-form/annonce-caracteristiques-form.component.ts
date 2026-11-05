import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { AnnonceCaracteristiquesService } from '../annonce-caracteristiques.service';


@Component({
  selector: 'app-annonce-caracteristiques-form',
  templateUrl: './annonce-caracteristiques-form.component.html',
  styleUrls: ['./annonce-caracteristiques-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnonceCaracteristiquesFormComponent implements OnInit {

  urlParam: any;
  constructor(
    private _annonceCaracteristiquesService: AnnonceCaracteristiquesService,
    private route: ActivatedRoute,
    private location: Location,
    private _adapter: DateAdapter<any>,

  ) { }

  isLoading: boolean = false;
  qrCodeValue: any;
  accountBalanceOptions: ApexOptions;

  public inProgress = false;
  public listeProjet: any[] = [];
  public listeUtilisateur: any[] = [];



  
  public displayedColumns: string[] = ['nom', 'prenoms', 'competence'];
  public dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginationDetail') paginationDetail: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;



  ngOnInit() {
    this.route.params.subscribe(params => {
      this.urlParam = params['id'];
      console.log('urlParam', this.urlParam);
    });

   

  } 


  goBack(): void {
    this.location.back();
  }


}
