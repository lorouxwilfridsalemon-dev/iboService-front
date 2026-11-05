import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../reservation.service';
import { AnnonceService } from '../../annonce/annonce.service';
// ⚠️ À VÉRIFIER : chemin du service générique Utilisateur — adaptez si
// différent dans votre projet.
// import { UtilisateurService } from '../../utilisateur/utilisateur.service';

/**
 * ✅ NOUVEAU : formulaire de création MANUELLE d'une réservation par
 * l'administrateur (ex: réservation prise par téléphone) — remplace
 * l'ancien formulaire copié depuis "Genre Personnes".
 */
@Component({
  selector: 'app-reservation-admin-form',
  templateUrl: './reservation-admin-form.component.html',
  styleUrls: ['./reservation-admin-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationAdminFormComponent implements OnInit { 

  constructor(
    public dialogRef: MatDialogRef<ReservationAdminFormComponent>,
    private _reservationService: ReservationService,
    private _annonceService: AnnonceService,
    // private _utilisateurService: UtilisateurService,
    public _formBuilder: FormBuilder,
  ) { }

  public form: FormGroup;
  public inProgress = false;

  public listeAnnonces: any[] = [];
  public listeClients: any[] = [];

  public readonly statuts = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirmee', label: 'Confirmée' },
    { value: 'annulee', label: 'Annulée' },
  ];

  ngOnInit() {
    this.buildForm();
    this._chargerAnnonces();
    // this._chargerClients();
  }

  private _chargerAnnonces(): void {
    this._annonceService.getListeAnnonceAll().subscribe({
      next: (result: any) => { this.listeAnnonces = result?.data ?? []; },
    });
  }

//   private _chargerClients(): void {
//     this._utilisateurService.query({
//       order: { nom: 'ASC' },
//       relations: [],
//       where: { geler: 0 },
//     }).subscribe({
//       next: (result: any) => { this.listeClients = result ?? []; },
//     });
//   }

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      annonceId: new FormControl(null, Validators.required),
      clientId: new FormControl(null, Validators.required),
      dateDebut: new FormControl(null, Validators.required),
      dateFin: new FormControl(null),
      montantTotal: new FormControl(0, Validators.required),
      statut: new FormControl('en_attente', Validators.required),
      description: new FormControl(null, Validators.maxLength(100)),
    });
  }

  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;
    this._reservationService.creerAdmin(this.form.value).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.dialogRef.close(result);
        }
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur lors de la création :', err?.error || err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}