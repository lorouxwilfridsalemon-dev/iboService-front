
// import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { PlanAbonnementService } from '../plan_abonnement.service';

// @Component({
//   selector: 'app-plan_abonnement-form',
//   templateUrl: './plan_abonnement-form.component.html',
//   styleUrls: ['./plan_abonnement-form.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class PlanAbonnementFormComponent implements OnInit {

//   constructor(
//     public dialogRef: MatDialogRef<PlanAbonnementFormComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private _planAbonnementService: PlanAbonnementService,
//     public _formBuilder: FormBuilder,
//   ) { }

//   public form: FormGroup;
//   public inProgress = false;

//   // ✅ Enum aligné sur le DTO backend
//   public codesDisponibles = [
//     { value: 'gratuit',  label: 'Gratuit'  },
//     { value: 'mensuel',  label: 'Mensuel'  },
//     { value: 'annuelle', label: 'Annuelle' },
//   ];

//   public devisesDisponibles = [
//     { value: 'FCFA', label: 'FCFA' },
//     { value: 'EUR',  label: 'EUR'  },
//     { value: 'USD',  label: 'USD'  },
//   ];

//   ngOnInit(): void {
//     this.buildForm();
//     if (this.data?.id) {
//       this.formPatchValue(this.data);
//     }
//   }

//   buildForm = (): void => {
//     this.form = this._formBuilder.group({
//       id:              new FormControl(null),
//       code:            new FormControl(null, Validators.compose([
//         Validators.required,
//         Validators.minLength(2),
//         Validators.maxLength(50),
//       ])),
//       nom:             new FormControl(null, Validators.compose([
//         Validators.required,
//         Validators.minLength(2),
//         Validators.maxLength(100),
//       ])),
//       description:     new FormControl(null, Validators.maxLength(255)),
//       prix:            new FormControl(0, Validators.compose([
//         Validators.required,
//         Validators.min(0),
//       ])),
//       devise:          new FormControl('FCFA'),
//       typeFacturation: new FormControl('gratuit', Validators.required),
//       nbAnnoncesMax:   new FormControl(5, Validators.compose([
//         Validators.required,
//         Validators.min(0),
//       ])),
//       videoAutorisee:  new FormControl(0),
//       badgeActif:      new FormControl(0),
//       nbPhotosMax:     new FormControl(5),
//       ordre:           new FormControl(0),
//       populaire:       new FormControl(0),
//       couleur:         new FormControl('#16A34A', Validators.maxLength(20)),
//       actif:           new FormControl(1),
//       dateCreation:    new FormControl(new Date().toISOString()),
//       geler:           new FormControl(0, Validators.required),
//       idusrcreation:   new FormControl(1, Validators.required),
//     });
//   };

//   formPatchValue(value: any): void {
//     this.form.patchValue({
//       id:              value.id,
//       code:            value.code,
//       nom:             value.nom ?? value.libelle ?? null,
//       description:     value.description ?? null,
//       prix:            value.prix ?? 0,
//       devise:          value.devise ?? 'FCFA',
//       typeFacturation: value.typeFacturation ?? 'gratuit',
//       nbAnnoncesMax:   value.nbAnnoncesMax ?? 5,
//       videoAutorisee:  value.videoAutorisee ?? 0,
//       badgeActif:      value.badgeActif ?? 0,
//       nbPhotosMax:     value.nbPhotosMax ?? 5,
//       ordre:           value.ordre ?? 0,
//       populaire:       value.populaire ?? 0,
//       couleur:         value.couleur ?? '#16A34A',
//       actif:           value.actif ?? 1,
//       dateCreation:    value.dateCreation ?? new Date().toISOString(),
//       geler:           value.geler ?? 0,
//       idusrcreation:   value.idusrcreation ?? 1,
//     });
//   }

//   // ==========================================================================
//   // SAVE — Création OU Modification
//   // ==========================================================================
//   save(): void {
//     if (this.form.invalid || this.inProgress) {
//       console.error('❌ Formulaire invalide');
//       return;
//     }

//     this.inProgress = true;
//     const rawValue: any = this.form.value;

//     // ✅ Body SANS id (l'id est déjà dans l'URL lors d'un PUT)
//     const planAbonnement: any = {
//       code:            String(rawValue.code),
//       nom:             String(rawValue.nom),
//       description:     rawValue.description || null,
//       prix:            Number(rawValue.prix),
//       devise:          String(rawValue.devise || 'FCFA'),
//       typeFacturation: String(rawValue.typeFacturation),
//       nbAnnoncesMax:   Number(rawValue.nbAnnoncesMax),
//       videoAutorisee:  Number(rawValue.videoAutorisee ?? 0),
//       badgeActif:      Number(rawValue.badgeActif ?? 0),
//       nbPhotosMax:     Number(rawValue.nbPhotosMax ?? 5),
//       ordre:           Number(rawValue.ordre ?? 0),
//       populaire:       Number(rawValue.populaire ?? 0),
//       couleur:         String(rawValue.couleur || '#16A34A'),
//       actif:           Number(rawValue.actif ?? 1),
//       dateCreation:    rawValue.dateCreation || new Date().toISOString(),
//       geler:           Number(rawValue.geler ?? 0),
//       idusrcreation:   Number(rawValue.idusrcreation ?? 1),
//     };

//     console.log('📤 Envoi du plan :', planAbonnement);
//     console.log('📤 Mode :', rawValue.id ? `UPDATE id=${rawValue.id}` : 'CREATE');

//     let send;
//     if (rawValue.id) {
//       // ✅ UPDATE : id dans l'URL, pas dans le body
//       send = this._planAbonnementService.updateWithId(rawValue.id, planAbonnement);
//     } else {
//       // ✅ CREATE : POST classique
//       send = this._planAbonnementService.save(planAbonnement);
//     }

//     send.subscribe({
//       next: (result) => {
//         this.inProgress = false;
//         console.log('✅ Succès :', result);
//         this.dialogRef.close(result?.data ?? result);
//       },
//       error: (err) => {
//         this.inProgress = false;
//         console.error('❌ Erreur complète :', err);
//         console.error('📋 Détail :', JSON.stringify(err?.error, null, 2));

//         // ✅ Affiche le détail des erreurs de validation backend (si dispo)
//         if (Array.isArray(err?.error?.errors)) {
//           console.error('🚨 Erreurs de validation :');
//           err.error.errors.forEach((e: any) => {
//             console.error(
//               `   • [${e.property}] value=${JSON.stringify(e.value)} →`,
//               e.constraints,
//             );
//           });
//         }
//       },
//     });
//   }

//   close(): void {
//     this.dialogRef.close();
//   }
// } 


import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PlanAbonnementService } from '../plan_abonnement.service';

@Component({
  selector: 'app-plan_abonnement-form',
  templateUrl: './plan_abonnement-form.component.html',
  styleUrls: ['./plan_abonnement-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanAbonnementFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlanAbonnementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _planAbonnementService: PlanAbonnementService,
    public _formBuilder: FormBuilder,
  ) { }

  public form: FormGroup;
  public inProgress = false;

  // ✅ Enum aligné sur le DTO backend
  public codesDisponibles = [
    { value: 'gratuit',  label: 'Gratuit'  },
    { value: 'mensuel',  label: 'Mensuel'  },
    { value: 'annuelle', label: 'Annuelle' },
  ];

  public devisesDisponibles = [
    { value: 'FCFA', label: 'FCFA' },
    { value: 'EUR',  label: 'EUR'  },
    { value: 'USD',  label: 'USD'  },
  ];

  ngOnInit(): void {
    this.buildForm();
    if (this.data?.id) {
      this.formPatchValue(this.data);
    }
  }

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id:              new FormControl(null),
      code:            new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),
      nom:             new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      description:     new FormControl(null, Validators.maxLength(255)),
      prix:            new FormControl(0, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])),
      devise:          new FormControl('FCFA'),
      typeFacturation: new FormControl('gratuit', Validators.required),
      nbAnnoncesMax:   new FormControl(5, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])),
      videoAutorisee:  new FormControl(0),
      badgeActif:      new FormControl(0),
      nbPhotosMax:     new FormControl(5),
      ordre:           new FormControl(0),
      populaire:       new FormControl(0),
      couleur:         new FormControl('#16A34A', Validators.maxLength(20)),
      actif:           new FormControl(1),
      dateCreation:    new FormControl(new Date().toISOString()),
      geler:           new FormControl(0, Validators.required),
      idusrcreation:   new FormControl(1, Validators.required),
    });
  };

  // ✅ Normalise les valeurs legacy pour éviter les erreurs 400
  private _normaliserCodePlan(val: any): string {
    if (!val) return 'gratuit';
    const v = String(val).toLowerCase().trim();
    if (v === 'annuel' || v === 'annuelle' || v === 'a_vie' || v === 'a vie' || v === 'avie') {
      return 'annuelle';
    }
    if (v === 'mensuel') return 'mensuel';
    if (v === 'gratuit') return 'gratuit';
    return 'gratuit';
  }

  formPatchValue(value: any): void {
    this.form.patchValue({
      id:              value.id,
      code:            this._normaliserCodePlan(value.code),
      nom:             value.nom ?? value.libelle ?? null,
      description:     value.description ?? null,
      prix:            value.prix ?? 0,
      devise:          value.devise ?? 'FCFA',
      typeFacturation: this._normaliserCodePlan(value.typeFacturation),
      nbAnnoncesMax:   value.nbAnnoncesMax ?? 5,
      videoAutorisee:  value.videoAutorisee ?? 0,
      badgeActif:      value.badgeActif ?? 0,
      nbPhotosMax:     value.nbPhotosMax ?? 5,
      ordre:           value.ordre ?? 0,
      populaire:       value.populaire ?? 0,
      couleur:         value.couleur ?? '#16A34A',
      actif:           value.actif ?? 1,
      dateCreation:    value.dateCreation ?? new Date().toISOString(),
      geler:           value.geler ?? 0,
      idusrcreation:   value.idusrcreation ?? 1,
    });
  }

  // ==========================================================================
  // SAVE — Création OU Modification
  // ==========================================================================
  save(): void {
    if (this.form.invalid || this.inProgress) {
      console.error('❌ Formulaire invalide');
      return;
    }

    this.inProgress = true;
    const rawValue: any = this.form.value;

    // ✅ Body SANS id (l'id est déjà dans l'URL lors d'un PUT)
    const planAbonnement: any = {
      code:            String(rawValue.code),
      nom:             String(rawValue.nom),
      description:     rawValue.description || null,
      prix:            Number(rawValue.prix),
      devise:          String(rawValue.devise || 'FCFA'),
      typeFacturation: String(rawValue.typeFacturation),
      nbAnnoncesMax:   Number(rawValue.nbAnnoncesMax),
      videoAutorisee:  Number(rawValue.videoAutorisee ?? 0),
      badgeActif:      Number(rawValue.badgeActif ?? 0),
      nbPhotosMax:     Number(rawValue.nbPhotosMax ?? 5),
      ordre:           Number(rawValue.ordre ?? 0),
      populaire:       Number(rawValue.populaire ?? 0),
      couleur:         String(rawValue.couleur || '#16A34A'),
      actif:           Number(rawValue.actif ?? 1),
      dateCreation:    rawValue.dateCreation || new Date().toISOString(),
      geler:           Number(rawValue.geler ?? 0),
      idusrcreation:   Number(rawValue.idusrcreation ?? 1),
    };

    console.log('📤 Envoi du plan :', planAbonnement);
    console.log('📤 Mode :', rawValue.id ? `UPDATE id=${rawValue.id}` : 'CREATE');

    let send;
    if (rawValue.id) {
      send = this._planAbonnementService.updateWithId(rawValue.id, planAbonnement);
    } else {
      send = this._planAbonnementService.save(planAbonnement);
    }

    send.subscribe({
      next: (result) => {
        this.inProgress = false;
        console.log('✅ Succès :', result);
        this.dialogRef.close(result?.data ?? result);
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur complète :', err);
        console.error('📋 Détail :', JSON.stringify(err?.error, null, 2));

        if (Array.isArray(err?.error?.errors)) {
          console.error('🚨 Erreurs de validation :');
          err.error.errors.forEach((e: any) => {
            console.error(
              `   • [${e.property}] value=${JSON.stringify(e.value)} →`,
              e.constraints,
            );
          });
        }
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}