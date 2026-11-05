import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnnonceInterface } from '../../annonce.interface';
import { AnnonceService } from '../../annonce.service';
import { SousCategoriesService } from '../../../parametre/sous-categories/sous-categories.service';
import { CaracteristiquesService } from '../../../parametre/caracteristiques/caracteristiques.service';

@Component({
  selector: 'app-annonce-modal-form',
  templateUrl: './annonce-modal-form.component.html',
  styleUrls: ['./annonce-modal-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnonceModalFormComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _annonceService: AnnonceService,
    private _sousCategoriesService: SousCategoriesService,
    private _caracteristiquesService: CaracteristiquesService,
    public _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
  ) { }

  public form: FormGroup;
  public inProgress = false;
  public chargementInitial = true;
  public annonceId: number;
  public annonceOriginale: AnnonceInterface;

  // ✅ Mode : création ou modification
  public isCreation = true;

  public listeSousCategories: any[] = [];
  public listeCaracteristiques: any[] = [];

  // ✅ Fichiers à uploader (mode création)
  public imagesFiles: File[] = [];
  public videosFiles: File[] = [];
  public cvFile: File | null = null;
  public pieceFile: File | null = null;

  // ✅ Aperçu des images
  public imagesPreview: { file: File; url: string }[] = [];

  public readonly typesPrix = [
    { value: '1', label: 'Par jour' },
    { value: '2', label: 'Par mois' },
    { value: '3', label: 'Par nuitée' },
    { value: '4', label: 'Par intervention' },
  ];

  ngOnInit() {
    this.buildForm();
    this._chargerSousCategories();
    this._chargerCaracteristiques();

    this.annonceId = Number(this._route.snapshot.paramMap.get('id'));
    this.isCreation = !this.annonceId;

    if (this.annonceId) {
      this._annonceService.findById(this.annonceId).subscribe({
        next: (result: any) => {
          this.chargementInitial = false;
          this.annonceOriginale = result?.data;
          this.formPatchValue(result?.data);
        },
        error: () => {
          this.chargementInitial = false;
        },
      });
    } else {
      this.chargementInitial = false;
    }
  }

  // =========================================================================
  // CHARGEMENT DES LISTES
  // =========================================================================

  private _chargerSousCategories(): void {
    this._sousCategoriesService.getListeSousCategories().subscribe({
      next: (result: any) => { this.listeSousCategories = result?.data ?? []; },
    });
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

  // =========================================================================
  // FORMULAIRE
  // =========================================================================

  buildForm = (): void => {
    this.form = this._formBuilder.group({
      // Informations générales
      titre: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(100)])),
      description: new FormControl(null, Validators.maxLength(255)),
      sousCategorieId: new FormControl(null, Validators.required),
      adresse: new FormControl(null, Validators.maxLength(255)),
      longitude: new FormControl(null),
      latitude: new FormControl(null),

      // Prix
      prix: new FormControl(null),
      typePrix: new FormControl('1'),

      // Détails du bien
      nombreChambres: new FormControl(0),
      nombreDouches: new FormControl(0),
      nombreSalon: new FormControl(0),
      typeLocation: new FormControl(null),

      // Conditions de location
      cautionMois: new FormControl(0),
      avanceMois: new FormControl(0),
      fraisVisite: new FormControl(0),

      // Équipements
      estMeuble: new FormControl(false),
      estAutomatique: new FormControl(false),
      aGps: new FormControl(false),

      // Caractéristiques (tableau d'ids)
      caracteristiquesIds: new FormControl([]),
    });
  };

  formPatchValue(annonce: AnnonceInterface) {
    if (!annonce) return;
    this.form.patchValue({
      titre: annonce.titre,
      description: annonce.description,
      sousCategorieId: annonce.sousCategorie?.id ?? null,
      adresse: annonce.adresse,
      longitude: annonce.longitude,
      latitude: annonce.latitude,
      prix: annonce.prix,
      typePrix: (annonce as any).typePrix ?? '1',
      nombreChambres: (annonce as any).nombreChambres ?? 0,
      nombreDouches: (annonce as any).nombreDouches ?? 0,
      nombreSalon: (annonce as any).nombreSalon ?? 0,
      typeLocation: annonce.typeLocation,
      cautionMois: annonce.conditionsLocation?.cautionMois ?? 0,
      avanceMois: annonce.conditionsLocation?.avanceMois ?? 0,
      fraisVisite: annonce.conditionsLocation?.fraisVisite ?? 0,
      estMeuble: (annonce as any).estMeuble ?? false,
      estAutomatique: (annonce as any).estAutomatique ?? false,
      aGps: (annonce as any).aGps ?? false,
      caracteristiquesIds: (annonce as any).caracteristiques?.map((c: any) => c.caracteristiqueId) ?? [],
    });
  }

  // =========================================================================
  // GESTION DES FICHIERS
  // =========================================================================

  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.imagesFiles.push(file);

        // Aperçu
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesPreview.push({ file, url: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }

    // Reset input pour permettre de re-sélectionner le même fichier
    event.target.value = '';
  }

  onVideosSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        this.videosFiles.push(file);
      }
    }

    event.target.value = '';
  }

  onCvSelected(event: any): void {
    const file: File = event.target.files?.[0];
    if (file) this.cvFile = file;
    event.target.value = '';
  }

  onPieceSelected(event: any): void {
    const file: File = event.target.files?.[0];
    if (file) this.pieceFile = file;
    event.target.value = '';
  }

  supprimerImage(index: number): void {
    this.imagesFiles.splice(index, 1);
    this.imagesPreview.splice(index, 1);
  }

  supprimerVideo(index: number): void {
    this.videosFiles.splice(index, 1);
  }

  supprimerCv(): void {
    this.cvFile = null;
  }

  supprimerPiece(): void {
    this.pieceFile = null;
  }

  // =========================================================================
  // SAUVEGARDE
  // =========================================================================

  save(): void {
    if (this.form.invalid || this.inProgress) return;

    this.inProgress = true;

    // ✅ 1. Préparer les champs texte
    const raw = this.form.value;
    const champs: any = {
      titre:           String(raw.titre),
      description:     raw.description || '',
      prix:            Number(raw.prix) || 0,
      type_prix:       String(raw.typePrix || '1'),
      id_sca:          Number(raw.sousCategorieId),
      adresse:         raw.adresse || '',
      longitude:       raw.longitude || 0,
      latitude:        raw.latitude || 0,
      nombre_chambres: Number(raw.nombreChambres) || 0,
      nombre_douches:  Number(raw.nombreDouches) || 0,
      nombre_salon:    Number(raw.nombreSalon) || 0,
      type_location:   raw.typeLocation || 'Location simple',
      caution_mois:    String(raw.cautionMois || 0),
      avance_mois:     String(raw.avanceMois || 0),
      frais_visite:    Number(raw.fraisVisite) || 0,
      est_meuble:      raw.estMeuble ? '1' : '0',
      est_automatique: raw.estAutomatique ? '1' : '0',
      a_gps:           raw.aGps ? '1' : '0',
      caracteristiques: JSON.stringify(raw.caracteristiquesIds || []),
    };

    // ✅ 2. Mode CRÉATION → upload multipart
    if (this.isCreation) {
      this._annonceService.publier({
        champs,
        images: this.imagesFiles,
        videos: this.videosFiles,
        cv: this.cvFile,
        piece: this.pieceFile,
      }).subscribe({
        next: () => {
          this.inProgress = false;
          this._snackBar.open('✅ Annonce publiée avec succès', 'Fermer', {
            duration: 3000,
            panelClass: 'snackbar-success',
          });
          this._router.navigate(['/annonce']);
        },
        error: (err) => {
          this.inProgress = false;
          console.error('❌ Erreur publication :', err);
          this._snackBar.open(
            `❌ ${err?.error?.message || 'Erreur lors de la publication'}`,
            'Fermer',
            { duration: 5000, panelClass: 'snackbar-error' },
          );
        },
      });
      return;
    }

    // ✅ 3. Mode MODIFICATION → PUT JSON classique
    this._annonceService.modifier(this.annonceId, this.form.value).subscribe({
      next: () => {
        this.inProgress = false;
        this._snackBar.open('✅ Annonce modifiée avec succès', 'Fermer', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
        this._router.navigate(['/annonce']);
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur modification :', err);
        this._snackBar.open(
          `❌ ${err?.error?.message || 'Erreur lors de la modification'}`,
          'Fermer',
          { duration: 5000, panelClass: 'snackbar-error' },
        );
      },
    });
  }

  annuler(): void {
    this._router.navigate(['/annonce']);
  }
}