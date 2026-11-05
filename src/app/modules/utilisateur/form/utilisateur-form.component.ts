import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { ProfilService } from 'app/modules/parametre/profil/profil.service';
// ✅ AJOUT : nécessaire pour charger dynamiquement la liste des profils.
// import { ProfilService } from '../../profil/profil.service';

@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UtilisateurFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UtilisateurFormComponent>,
    private _utilisateurService: UtilisateurService,
    private _profilService: ProfilService,
    public _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; utilisateur?: any }
  ) { }

  public form: FormGroup;
  public inProgress = false; 
  public isEditMode = false;
  public titreFormulaire = 'Nouvel utilisateur';

  // ✅ CORRIGÉ : n'est plus une liste statique — chargée dynamiquement
  // via listeProfils() dans ngOnInit(). Reflète maintenant les vrais
  // profils créés/modifiés/supprimés depuis la page Profils, au lieu
  // d'IDs figés en dur qui pouvaient ne plus correspondre à rien.
  public profils: any[] = [];

  ngOnInit() {
    this.isEditMode = this.data?.mode === 'edit';
    this.titreFormulaire = this.isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur';
    this.buildForm();
    this._chargerProfils();

    if (this.isEditMode && this.data?.utilisateur) {
      this.form.patchValue({
        ...this.data.utilisateur,
        // ✅ Reconvertit 0/1 (venant du backend) en booléen pour
        // l'affichage du toggle — conversion inverse faite dans save().
        actif: this.data.utilisateur.geler === 0,
      });
    }
  }

  private _chargerProfils(): void {
    this._profilService.listeProfils().subscribe({
      next: (result: any) => { this.profils = result?.data ?? []; },
    });
  }

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      nom: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      prenom: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      pseudo: new FormControl('', Validators.maxLength(100)),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', Validators.maxLength(100)),
      motDePasse: new FormControl('', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]),
      description: new FormControl('', Validators.maxLength(255)),
      language: new FormControl('fr'),
      devise: new FormControl('XOF'),
      actif: new FormControl(true),
      id_pro: new FormControl(null),
    });
  }

  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;
    const formValue = this.form.value;

    const payload: any = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      pseudo: formValue.pseudo,
      email: formValue.email,
      contact: formValue.contact,
      description: formValue.description,
      language: formValue.language,
      devise: formValue.devise,
      id_pro: formValue.id_pro,
      geler: formValue.actif ? 0 : 1,
    };
    if (formValue.motDePasse) {
      payload.motDePasse = formValue.motDePasse;
    }

    const request = this.isEditMode
      ? this._utilisateurService.update(this.data.utilisateur.id, payload)
      : this._utilisateurService.create(payload);

    request.subscribe({
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