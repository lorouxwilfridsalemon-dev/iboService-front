// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { AbonnementService } from '../abonnement.service';

// /**
//  * Formulaire de création MANUELLE d'un abonnement par l'administrateur
//  * (ex: abonnement souscrit par téléphone, offre offerte, etc.).
//  *
//  * ⚠️ Le nom du composant reste `AbonnementAdminFormComponent`.
//  */
// @Component({
//   selector: 'app-abonnement-admin-form',
//   templateUrl: './abonnement-admin-form.component.html',
//   styleUrls: ['./abonnement-admin-form.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class AbonnementAdminFormComponent implements OnInit {

//   constructor(
//     public dialogRef: MatDialogRef<AbonnementAdminFormComponent>,
//     private _abonnementService: AbonnementService,
//     public _formBuilder: FormBuilder,
//   ) { }

//   public form: FormGroup;
//   public inProgress = false;

//   /** Liste des plans récupérés depuis l'API (gratuit, mensuel, à vie) */
//   public listePlans: any[] = [];

//   /** Liste des utilisateurs (clients) pouvant souscrire */
//   public listeUtilisateurs: any[] = [];

//   /** Types de facturation disponibles (alignés sur l'enum backend) */
//   public readonly typesFacturation = [
//     { value: 'gratuit', label: 'Gratuit' },
//     { value: 'mensuel', label: 'Mensuel' },
//     { value: 'a_vie', label: 'À vie' },
//   ];

//   /** Statuts alignés sur l'enum AbonnementStatut du backend */
//   public readonly statuts = [
//     { value: 'en_attente', label: 'En attente' },
//     { value: 'actif', label: 'Actif' },
//     { value: 'expire', label: 'Expiré' },
//     { value: 'annule', label: 'Annulé' },
//     { value: 'suspendu', label: 'Suspendu' },
//   ];

//   /** Devises supportées */
//   public readonly devises = ['XOF', 'EUR', 'USD'];

//   ngOnInit() {
//     this.buildForm();
//     this._chargerPlans();
//     this._chargerUtilisateurs();
//   }

//   // =========================================================================
//   // CHARGEMENT DES DONNÉES
//   // =========================================================================

//   private _chargerPlans(): void {
//     this._abonnementService.getPlans().subscribe({
//       next: (result: any) => {
//         this.listePlans = result?.data ?? [];

//         // Si un plan est sélectionné par défaut → pré-remplir le formulaire
//         if (this.listePlans.length && !this.form.get('planId')?.value) {
//           this.onPlanChange(this.listePlans[0].id);
//         }
//       },
//       error: (err) => console.error('❌ Erreur chargement plans :', err),
//     });
//   }

//   /**
//    * ⚠️ À ADAPTER : utilisez votre service Utilisateur réel.
//    * Exemple : this._utilisateurService.query({...})
//    */
//   private _chargerUtilisateurs(): void {
//     // Décommentez et adaptez selon votre projet :
//     // this._utilisateurService.query({
//     //   order: { nom: 'ASC' },
//     //   where: { geler: 0 },
//     // }).subscribe({
//     //   next: (result: any) => { this.listeUtilisateurs = result ?? []; },
//     // });
//   }

//   // =========================================================================
//   // FORMULAIRE
//   // =========================================================================

//   buildForm = (): void => {
//     this.form = this._formBuilder.group({
//       utilisateurId: new FormControl(null, Validators.required),
//       planId: new FormControl(null, Validators.required),
//       typeFacturation: new FormControl('mensuel', Validators.required),
//       dateDebut: new FormControl(new Date(), Validators.required),
//       dateFin: new FormControl(null),
//       dateProchainPaiement: new FormControl(null),
//       montantPaye: new FormControl(0, [Validators.required, Validators.min(0)]),
//       devise: new FormControl('XOF', Validators.required),
//       statut: new FormControl('en_attente', Validators.required),
//       autoRenouvellement: new FormControl(1),
//       annoncesUtilisees: new FormControl(0, Validators.min(0)),
//       boostsUtilises: new FormControl(0, Validators.min(0)),
//       raisonAnnulation: new FormControl(null, Validators.maxLength(500)),
//     });
//   };

//   // =========================================================================
//   // RÉACTIONS AUX CHANGEMENTS
//   // =========================================================================

//   /**
//    * Quand on sélectionne un plan → pré-remplir prix, devise, type de facturation
//    * et calculer la date de fin automatiquement si mensuel.
//    */
//   onPlanChange(planId: number): void {
//     const plan = this.listePlans.find((p) => p.id === planId);
//     if (!plan) return;

//     const dateDebut = this.form.get('dateDebut')?.value || new Date();
//     let dateFin: Date | null = null;
//     let dateProchainPaiement: Date | null = null;

//     if (plan.typeFacturation === 'mensuel') {
//       dateFin = new Date(dateDebut);
//       dateFin.setMonth(dateFin.getMonth() + 1);
//       dateProchainPaiement = new Date(dateFin);
//     }

//     this.form.patchValue({
//       typeFacturation: plan.typeFacturation,
//       montantPaye: plan.prix,
//       devise: plan.devise || 'XOF',
//       dateFin,
//       dateProchainPaiement,
//       statut: plan.prix === 0 ? 'actif' : 'en_attente',
//     }, { emitEvent: false });
//   }

//   /**
//    * Quand on change la date de début → recalculer la date de fin si mensuel.
//    */
//   onDateDebutChange(): void {
//     const planId = this.form.get('planId')?.value;
//     if (planId) this.onPlanChange(planId);
//   }

//   // =========================================================================
//   // SOUMISSION
//   // =========================================================================

//   save(): void {
//     if (this.form.invalid || this.inProgress) return;

//     this.inProgress = true;

//     const payload = {
//       utilisateur_id_usr: this.form.value.utilisateurId,
//       plan_id_pab: this.form.value.planId,
//       typeFacturation: this.form.value.typeFacturation,
//       dateDebut: this._formatDate(this.form.value.dateDebut),
//       dateFin: this.form.value.dateFin ? this._formatDate(this.form.value.dateFin) : null,
//       dateProchainPaiement: this.form.value.dateProchainPaiement
//         ? this._formatDate(this.form.value.dateProchainPaiement)
//         : null,
//       montantPaye: Number(this.form.value.montantPaye) || 0,
//       devise: this.form.value.devise,
//       statut: this.form.value.statut,
//       autoRenouvellement: this.form.value.autoRenouvellement ? 1 : 0,
//       annoncesUtilisees: Number(this.form.value.annoncesUtilisees) || 0,
//       boostsUtilises: Number(this.form.value.boostsUtilises) || 0,
//       raisonAnnulation: this.form.value.raisonAnnulation || null,
//       geler: 0,
//     };

//     this._abonnementService.creerAdmin(payload).subscribe({
//       next: (result) => {
//         this.inProgress = false;
//         if (result) this.dialogRef.close(result);
//       },
//       error: (err) => {
//         this.inProgress = false;
//         console.error('❌ Erreur lors de la création :', err?.error || err);
//       },
//     });
//   }

//   private _formatDate(date: Date | string): string {
//     if (!date) return null as any;
//     const d = typeof date === 'string' ? new Date(date) : date;
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   close() {
//     this.dialogRef.close();
//   }
// }

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AbonnementService } from '../abonnement.service';
import { UtilisateurService } from '../../utilisateur/utilisateur.service';

@Component({
  selector: 'app-abonnement-admin-form',
  templateUrl: './abonnement-admin-form.component.html',
  styleUrls: ['./abonnement-admin-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbonnementAdminFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AbonnementAdminFormComponent>,
    private _abonnementService: AbonnementService,
    private _utilisateurService: UtilisateurService,
    public _formBuilder: FormBuilder,
  ) { }

  public form: FormGroup;
  public inProgress = false;
  public isLoadingUtilisateurs = false;

  public listePlans: any[] = [];
  public listeUtilisateurs: any[] = [];
  public listeUtilisateursFiltres: any[] = [];

  // ✅ ALIGNÉ sur l'enum TypeFacturation du backend
  public readonly typesFacturation = [
    { value: 'gratuit',  label: 'Gratuit'  },
    { value: 'mensuel',  label: 'Mensuel'  },
    { value: 'a_vie',    label: 'À vie'    },   // ✅ conservé pour compatibilité
    { value: 'annuelle', label: 'Annuelle' },   // ✅ AJOUTÉ
  ];

  public readonly statuts = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'actif',      label: 'Actif'      },
    { value: 'expire',     label: 'Expiré'     },
    { value: 'annule',     label: 'Annulé'     },
    { value: 'suspendu',   label: 'Suspendu'   },
  ];

  public readonly devises = ['XOF', 'EUR', 'USD'];

  ngOnInit() {
    this.buildForm();
    this._chargerPlans();
    this._chargerUtilisateurs();
  }

  // =========================================================================
  // CHARGEMENT DES DONNÉES
  // =========================================================================

  private _chargerPlans(): void {
    this._abonnementService.getPlans().subscribe({
      next: (result: any) => {
        this.listePlans = result?.data ?? [];
        if (this.listePlans.length && !this.form.get('planId')?.value) {
          this.onPlanChange(this.listePlans[0].id);
        }
      },
      error: (err) => console.error('❌ Erreur chargement plans :', err),
    });
  }

  private _chargerUtilisateurs(): void {
    this.isLoadingUtilisateurs = true;

    this._utilisateurService.findAll({ geler: 0 }).subscribe({
      next: (result: any) => {
        this.isLoadingUtilisateurs = false;

        const data = Array.isArray(result)
          ? result
          : (result?.data ?? result?.utilisateurs ?? []);

        this.listeUtilisateurs = data;
        this.listeUtilisateursFiltres = [...data];
      },
      error: (err) => {
        this.isLoadingUtilisateurs = false;
        console.error('❌ Erreur chargement utilisateurs :', err);
        this.listeUtilisateurs = [];
        this.listeUtilisateursFiltres = [];
      },
    });
  }

  // =========================================================================
  // FORMULAIRE
  // =========================================================================

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      utilisateurId:          new FormControl(null, Validators.required),
      planId:                 new FormControl(null, Validators.required),
      typeFacturation:        new FormControl('mensuel', Validators.required),
      dateDebut:              new FormControl(new Date(), Validators.required),
      dateFin:                new FormControl(null),
      dateProchainPaiement:   new FormControl(null),
      montantPaye:            new FormControl(0, [Validators.required, Validators.min(0)]),
      devise:                 new FormControl('XOF', Validators.required),
      statut:                 new FormControl('en_attente', Validators.required),
      autoRenouvellement:     new FormControl(1),
      annoncesUtilisees:      new FormControl(0, Validators.min(0)),
      boostsUtilises:         new FormControl(0, Validators.min(0)),
      raisonAnnulation:       new FormControl(null, Validators.maxLength(500)),
    });
  };

  // ==========================================================================
  // ✅ Calcul des dates selon le type de facturation
  // ==========================================================================
  onPlanChange(planId: number): void {
    const plan = this.listePlans.find((p) => p.id === planId);
    if (!plan) return;

    const dateDebut: Date = this.form.get('dateDebut')?.value || new Date();
    let dateFin: Date | null = null;
    let dateProchainPaiement: Date | null = null;

    // ✅ Gestion des différents types de facturation
    switch (plan.typeFacturation) {
      case 'mensuel':
        dateFin = new Date(dateDebut);
        dateFin.setMonth(dateFin.getMonth() + 1);
        dateProchainPaiement = new Date(dateFin);
        break;

      case 'annuelle':
        dateFin = new Date(dateDebut);
        dateFin.setFullYear(dateFin.getFullYear() + 1);
        dateProchainPaiement = new Date(dateFin);
        break;

      case 'a_vie':
        // À vie : pas de date de fin ni de prochain paiement
        dateFin = null;
        dateProchainPaiement = null;
        break;

      case 'gratuit':
      default:
        // Gratuit : pas de date de fin ni de prochain paiement
        dateFin = null;
        dateProchainPaiement = null;
        break;
    }

    this.form.patchValue({
      typeFacturation: plan.typeFacturation,
      montantPaye:     plan.prix,
      devise:          plan.devise || 'XOF',
      dateFin,
      dateProchainPaiement,
      statut:          plan.prix === 0 ? 'actif' : 'en_attente',
    }, { emitEvent: false });
  }

  onDateDebutChange(): void {
    const planId = this.form.get('planId')?.value;
    if (planId) this.onPlanChange(planId);
  }

  onSearchUtilisateur(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (!term) {
      this.listeUtilisateursFiltres = [...this.listeUtilisateurs];
      return;
    }

    this.listeUtilisateursFiltres = this.listeUtilisateurs.filter(u => {
      const nom = `${u.prenom ?? ''} ${u.nom ?? ''}`.toLowerCase();
      const contact = `${u.contact ?? u.telephone ?? u.email ?? ''}`.toLowerCase();
      return nom.includes(term) || contact.includes(term);
    });
  }

  // =========================================================================
  // SOUMISSION
  // =========================================================================

  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;

    const payload = {
      utilisateur_id_usr:     Number(this.form.value.utilisateurId),
      plan_id_pab:            Number(this.form.value.planId),
      typeFacturation:        this.form.value.typeFacturation,
      dateDebut:              this._formatDate(this.form.value.dateDebut),
      dateFin:                this.form.value.dateFin
                                ? this._formatDate(this.form.value.dateFin)
                                : null,
      dateProchainPaiement:   this.form.value.dateProchainPaiement
                                ? this._formatDate(this.form.value.dateProchainPaiement)
                                : null,
      montantPaye:            Number(this.form.value.montantPaye) || 0,
      devise:                 this.form.value.devise,
      statut:                 this.form.value.statut,
      autoRenouvellement:     this.form.value.autoRenouvellement ? 1 : 0,
      annoncesUtilisees:      Number(this.form.value.annoncesUtilisees) || 0,
      boostsUtilises:         Number(this.form.value.boostsUtilises) || 0,
      raisonAnnulation:       this.form.value.raisonAnnulation || null,
      geler:                  0,
    };

    console.log('📤 Payload abonnement admin :', payload);

    this._abonnementService.creerAdmin(payload).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) this.dialogRef.close(result);
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur lors de la création :', err?.error || err);
      },
    });
  }

  private _formatDate(date: Date | string): string {
    if (!date) return null as any;
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  close() {
    this.dialogRef.close();
  }
} 