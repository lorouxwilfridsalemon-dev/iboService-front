// import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { CaracteristiqueSousCategoriesService } from '../caracteristique_sous_categories.service';
// import { CaracteristiquesService } from '../../caracteristiques/caracteristiques.service';
// import { SousCategoriesService } from '../../sous-categories/sous-categories.service';

// @Component({
//   selector: 'app-caracteristique_sous_categories-form',
//   templateUrl: './caracteristique_sous_categories-form.component.html',
//   styleUrls: ['./caracteristique_sous_categories-form.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class CaracteristiqueSousCategoriesFormComponent implements OnInit {

//   constructor(
//     public dialogRef: MatDialogRef<CaracteristiqueSousCategoriesFormComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private _caracteristiqueSousCategoriesService: CaracteristiqueSousCategoriesService,
//     // ✅ AJOUT : nécessaires pour peupler les DEUX sélecteurs — avant,
//     // le formulaire demandait un "nom"/"description" qui n'existent pas
//     // sur cette entité pivot (elle ne fait QUE lier deux id).
//     private _caracteristiquesService: CaracteristiquesService,
//     private _sousCategoriesService: SousCategoriesService,
//     public _formBuilder: FormBuilder,
//   ) { }

//   public form: FormGroup;
//   public inProgress = false;
//   public listeCaracteristiques: any[] = [];
//   public listeSousCategories: any[] = [];

//   ngOnInit() {
//     this.buildForm();
//     this._chargerCaracteristiques();
//     this._chargerSousCategories();
//   }

//   private _chargerCaracteristiques(): void {
//     this._caracteristiquesService.query({
//       order: { nom: 'ASC' },
//       relations: [],
//       where: { geler: 0 },
//     }).subscribe({
//       next: (result: any) => { this.listeCaracteristiques = result ?? []; },
//     });
//   }

//   private _chargerSousCategories(): void {
//     this._sousCategoriesService.getListeSousCategories().subscribe({
//       next: (result: any) => { this.listeSousCategories = result?.data ?? []; },
//     });
//   }

//   // ✅ CORRIGÉ : le formulaire ne demande plus "nom"/"description"
//   // (inexistants sur cette entité) mais bien les DEUX relations
//   // attendues — une caractéristique ET une sous-catégorie à lier.
//   buildForm = (): void => {
//     this.form = this._formBuilder.group({
//       caracteristiqueId: new FormControl(null, Validators.required),
//       sousCategorieId: new FormControl(null, Validators.required),
//     });
//   }

//   save(): void {
//     if (this.form.invalid || this.inProgress) return;

//     this.inProgress = true;
//     const { caracteristiqueId, sousCategorieId } = this.form.value;

//     this._caracteristiqueSousCategoriesService
//       .create(caracteristiqueId, sousCategorieId)
//       .subscribe({
//         next: (result) => {
//           this.inProgress = false;
//           if (result) {
//             this.dialogRef.close(result);
//           }
//         },
//         error: (err) => {
//           this.inProgress = false;
//           console.error('❌ Erreur lors de la création de la liaison :', err?.error || err);
//         },
//       });
//   }

//   close() {
//     this.dialogRef.close();
//   }
// }

import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CaracteristiqueSousCategoriesService } from '../caracteristique_sous_categories.service';
import { CaracteristiquesService } from '../../caracteristiques/caracteristiques.service';
import { SousCategoriesService } from '../../sous-categories/sous-categories.service';

@Component({
  selector: 'app-caracteristique_sous_categories-form',
  templateUrl: './caracteristique_sous_categories-form.component.html',
  styleUrls: ['./caracteristique_sous_categories-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaracteristiqueSousCategoriesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CaracteristiqueSousCategoriesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _caracteristiqueSousCategoriesService: CaracteristiqueSousCategoriesService,
    private _caracteristiquesService: CaracteristiquesService,
    private _sousCategoriesService: SousCategoriesService,
    public _formBuilder: FormBuilder,
  ) { }

  public form: FormGroup;
  public inProgress = false;
  public listeCaracteristiques: any[] = [];
  public listeSousCategories: any[] = [];

  ngOnInit() {
    this.buildForm();
    this._chargerCaracteristiques();
    this._chargerSousCategories();
  }

  private _chargerCaracteristiques(): void {
    this._caracteristiquesService.query({
      order: { nom: 'ASC' },
      relations: [],
      where: { geler: 0 },
    }).subscribe({
      next: (result: any) => { this.listeCaracteristiques = result ?? []; },
    });
  }

  private _chargerSousCategories(): void {
    this._sousCategoriesService.getListeSousCategories().subscribe({
      next: (result: any) => { this.listeSousCategories = result?.data ?? []; },
    });
  }

  // ✅ MODIFIÉ : choix multiple sur les deux sélecteurs — tableaux d'ids
  // au lieu d'un id unique.
  buildForm = (): void => {
    this.form = this._formBuilder.group({
      caracteristiqueIds: new FormControl([], Validators.required),
      sousCategorieIds: new FormControl([], Validators.required),
    });
  }

  // ✅ MODIFIÉ : crée UNE liaison pour chaque combinaison
  // (caractéristique × sous-catégorie) sélectionnée, en parallèle.
  // Un doublon déjà existant (rejeté par le backend) n'empêche pas la
  // création des autres combinaisons valides.
  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;
    const { caracteristiqueIds, sousCategorieIds } = this.form.value;

    const appels = [];
    for (const caracteristiqueId of caracteristiqueIds) {
      for (const sousCategorieId of sousCategorieIds) {
        appels.push(
          this._caracteristiqueSousCategoriesService
            .create(caracteristiqueId, sousCategorieId)
            .pipe(catchError((err) => {
              console.warn('⚠️ Liaison ignorée (déjà existante ou erreur) :', err?.error || err);
              return of(null);
            })),
        );
      }
    }

    forkJoin(appels).subscribe({
      next: (resultats) => {
        this.inProgress = false;
        this.dialogRef.close(resultats);
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur lors de la création des liaisons :', err?.error || err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}