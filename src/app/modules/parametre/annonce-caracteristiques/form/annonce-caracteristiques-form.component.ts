import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AnnonceCaracteristiquesService } from '../annonce-caracteristiques.service';
import { DateAdapter } from '@angular/material/core';
import { CaracteristiquesService } from '../../caracteristiques/caracteristiques.service';
import { AnnonceService } from 'app/modules/annonce/annonce.service';
// import { AnnonceService } from '../../annonce/annonce.service'; // À importer si tu as ce service

@Component({
  selector: 'app-annonce-caracteristiques-form',
  templateUrl: './annonce-caracteristiques-form.component.html',
  styleUrls: ['./annonce-caracteristiques-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnonceCaracteristiquesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AnnonceCaracteristiquesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: AnnonceCaracteristiquesService,
    private _caracteristiquesService: CaracteristiquesService,
    private _annonceService: AnnonceService, // À injecter si tu l'as
    public _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
  ) { }

  public form: FormGroup;
  public inProgress: boolean = false;
  public listeCaracteristiques: any[] = [];
  public listeAnnonces: any[] = [];

  ngOnInit() {
    this.loadLists();
    this.buildForm();
    if (this.data?.id) {
      this.formPatchValue(this.data);
    }
  }

  // ✅ Chargement des listes pour les select
  loadLists() {
    // Charger les caractéristiques
    this._caracteristiquesService.query({
      order: { id: 'DESC' },
      where: { geler: 0 }
    }).subscribe(result => {
      this.listeCaracteristiques = result;
    });

    // Charger les annonces (adapter selon ton service)
    // Si tu n'as pas encore de service Annonce, tu peux le créer ou le commenter
    this._annonceService.query({
      order: { id: 'DESC' },
      where: { geler: 0 }
    }).subscribe(result => {
      this.listeAnnonces = result;
    });
  }

  // ✅ Construction du formulaire
  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id: new FormControl(null),
      // ✅ CORRIGÉ : 'valeur' au lieu de 'libelle'
      valeur: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      description: new FormControl(null, Validators.maxLength(100)),
      // ✅ AJOUT : relations obligatoires
      caracteristique: new FormControl(null, Validators.required),
      annonce: new FormControl(null, Validators.required),
      dateCreation: new FormControl(new Date()),
      // Champs vides (optionnels)
      empty1: new FormControl(null),
      empty2: new FormControl(null),
      empty3: new FormControl(null),
      // ✅ CORRIGÉ : 'idusrcreation' au lieu de 'utilisateurCreation'
      idusrcreation: new FormControl(1, Validators.required),
      geler: new FormControl(0, Validators.required),
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
    const data: any = this.form.value;

    // ✅ Envoi : création ou modification
    const send = (!data.id)
      ? this._service.save(data)
      : this._service.update(data);

    send.subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.dialogRef.close(result);
        }
      },
      error: () => {
        this.inProgress = false;
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