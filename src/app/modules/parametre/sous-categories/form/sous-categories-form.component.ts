import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SousCategoriesService } from '../sous-categories.service';
import { CategoriesService } from '../../categories/categories.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-sous-categories-form',
  templateUrl: './sous-categories-form.component.html',
  styleUrls: ['./sous-categories-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SousCategoriesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SousCategoriesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sousCategoriesService: SousCategoriesService,
    // ✅ AJOUT : nécessaire pour peupler la liste déroulante des
    // catégories parentes.
    private _categoriesService: CategoriesService,
    public _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
  ) { }

  public form: FormGroup;
  public inProgress = false;
  // ✅ AJOUT : liste des catégories disponibles pour le sélecteur.
  public listeCategories: any[] = [];

  ngOnInit() {
    this.buildForm();
    this.chargerCategories();
    if (this.data?.id) {
      this.formPatchValue(this.data);
    }
  }

  /// ✅ AJOUT : charge la liste des catégories actives, pour le
  /// sélecteur "Catégorie parente" du formulaire.
  chargerCategories(): void {
    this._categoriesService.query({
      order: { nom: 'ASC' },
      relations: [],
      where: { geler: 0 },
    }).subscribe({
      next: (result: any) => {
        this.listeCategories = result;
      },
    });
  }

  // Construction du formulaire
  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id: new FormControl(null),
      // ✅ CORRIGÉ : 'nom' au lieu de 'libelle'.
      nom: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      // ✅ AJOUT : sélection obligatoire de la catégorie parente.
      categorie: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.maxLength(100)),
      dateCreation: new FormControl(new Date()),
      // ✅ RETIRÉ : empty4/empty5 n'existent pas sur SousCategoriesEntity
      // (seuls empty1 à empty3 existent) — les envoyer au serveur était
      // soit ignoré silencieusement, soit rejeté selon la config de
      // validation.
      empty1: new FormControl(null),
      empty2: new FormControl(null),
      empty3: new FormControl(null),
      geler: new FormControl(0, Validators.compose([Validators.required])),
      // ✅ CORRIGÉ : 'idusrcreation' au lieu de 'utilisateurCreation'.
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
    const valeurs = this.form.value;

    // ✅ MODIFIÉ : passe par la route métier /ajouterSousCategories
    // (payload simple : categorieId direct), qui évite complètement le
    // DTO générique et sa validation problématique sur les relations.
    const payload = {
      id: valeurs.id,
      nom: valeurs.nom,
      description: valeurs.description,
      categorieId: valeurs.categorie?.id,
      idusrcreation: valeurs.idusrcreation,
    };

    const send = (!payload.id)
      ? this._sousCategoriesService.ajouterSousCategories(payload)
      : this._sousCategoriesService.modifierSousCategories(payload.id, payload);

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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  close() {
    this.dialogRef.close();
  }
} 