import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProfilService } from '../profil.service';

@Component({
  selector: 'app-profil-form',
  templateUrl: './profil-form.component.html',
  styleUrls: ['./profil-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProfilFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _profilService: ProfilService,
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

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id: new FormControl(null),
      libelle: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      dateCreation: new FormControl(new Date()),
      geler: new FormControl(0, Validators.compose([Validators.required])),
      // ✅ CORRIGÉ : 'idusrcreation' au lieu de 'utilisateurCreation' —
      // c'est le vrai nom de la colonne sur ProfilEntity.
      idusrcreation: new FormControl(1, Validators.compose([Validators.required])),
    });
  }

  formPatchValue(value: any) {
    this.form.patchValue(value);
  }

  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;
    const profil: any = this.form.value;

    // ✅ MODIFIÉ : passe par le métier, plus par le CRUD générique.
    const send = (!profil.id)
      ? this._profilService.ajouterProfil(profil)
      : this._profilService.modifierProfil(profil.id, profil);

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