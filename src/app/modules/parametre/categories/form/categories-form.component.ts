// import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { CategoriesService } from '../categories.service';

// @Component({
//   selector: 'app-Categories-form',
//   templateUrl: './categories-form.component.html',
//   styleUrls: ['./categories-form.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class CategoriesFormComponent implements OnInit {

//   constructor(
//     public dialogRef: MatDialogRef<CategoriesFormComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private _categoriesService: CategoriesService,
//     public _formBuilder: FormBuilder,
//   ) { }

//   public form: FormGroup;
//   public inProgress = false;

//   ngOnInit() {
//     this.buildForm();
//     if (this.data?.id) {
//       this.formPatchValue(this.data);
//     }
//   }

//   // Construction du formulaire
//   buildForm = (): void => {
//     this.form = this._formBuilder.group({
//       id: new FormControl(null),
//       // ✅ CORRIGÉ : 'nom' au lieu de 'libelle' — correspond enfin à la
//       // vraie colonne (nom_cat) de CategoriesEntity. Sans ça, aucune
//       // catégorie créée ou modifiée via ce formulaire n'enregistrait
//       // réellement son nom.
//       nom: new FormControl(null, Validators.compose([
//         Validators.required,
//         Validators.minLength(2),
//         Validators.maxLength(100),
//       ])),
//       // ✅ AJOUT : champ absent du formulaire alors qu'il existe en base.
//       description: new FormControl(null, Validators.maxLength(100)),
//       dateCreation: new FormControl(new Date()),
//       geler: new FormControl(0, Validators.compose([Validators.required])),
//       // ✅ CORRIGÉ : 'idusrcreation' au lieu de 'utilisateurCreation' —
//       // même bug de nom de champ inexistant côté entité.
//       idusrcreation: new FormControl(1, Validators.compose([Validators.required])),
//     });
//   }

//   // Remplissage du formulaire avec les données initiales
//   formPatchValue(value: any) {
//     this.form.patchValue(value);
//   }

//   // Soumission du formulaire
//   save(): void {
//     if (this.form.invalid || this.inProgress) return;

//     this.inProgress = true;
//     const categories: any = this.form.value;

//     const send = (!categories.id)
//       ? this._categoriesService.save(categories)
//       : this._categoriesService.update(categories);

//     send.subscribe({
//       next: (result) => {
//         this.inProgress = false;
//         if (result) {
//           this.dialogRef.close(result);
//         }
//       },
//       error: () => {
//         this.inProgress = false;
//       },
//     });
//   }

//   close() {
//     this.dialogRef.close();
//   }
// } 

import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-Categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CategoriesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoriesService: CategoriesService,
    public _formBuilder: FormBuilder,
  ) { }

  public form: FormGroup;
  public inProgress = false;

  ngOnInit() {
    this.buildForm();
    if (this.data?.id) {
      this.formPatchValue(this.data);
    }
  }

  // Construction du formulaire
  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id: new FormControl(null),
      // ✅ CORRIGÉ : 'nom' au lieu de 'libelle' — correspond enfin à la
      // vraie colonne (nom_cat) de CategoriesEntity. Sans ça, aucune
      // catégorie créée ou modifiée via ce formulaire n'enregistrait
      // réellement son nom.
      nom: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      // ✅ AJOUT : champ absent du formulaire alors qu'il existe en base.
      description: new FormControl(null, Validators.maxLength(100)),
      dateCreation: new FormControl(new Date()),
      geler: new FormControl(0, Validators.compose([Validators.required])),
      // ✅ CORRIGÉ : 'idusrcreation' au lieu de 'utilisateurCreation' —
      // même bug de nom de champ inexistant côté entité.
      idusrcreation: new FormControl(1, Validators.compose([Validators.required])),
    });
  }

  // Remplissage du formulaire avec les données initiales
  formPatchValue(value: any) {
    this.form.patchValue(value);
  }

  // Soumission du formulaire
  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;
    const categories: any = this.form.value;

    // ✅ MODIFIÉ : passe par le métier — le CRUD générique échouait
    // avec "Validation object failed".
    const send = (!categories.id)
      ? this._categoriesService.ajouterCategories(categories)
      : this._categoriesService.modifierCategories(categories.id, categories);

    send.subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.dialogRef.close(result);
        }
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur lors de l\'enregistrement :', err?.error || err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
} 