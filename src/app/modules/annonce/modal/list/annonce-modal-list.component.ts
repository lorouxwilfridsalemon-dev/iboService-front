import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

/**
 * ✅ RECONSTRUIT ENTIÈREMENT — l'ancienne version affichait nom/prénoms/
 * date de naissance (copiée depuis un module "Personne") et rechargeait
 * en plus TOUTE la liste des annonces dans un tableau, alors qu'il ne
 * s'agit ici que d'afficher le détail d'UNE SEULE annonce déjà reçue
 * via MAT_DIALOG_DATA (le composant appelant a déjà fait l'appel
 * findById() avant d'ouvrir cette modale).
 */
@Component({
  selector: 'app-annonce-modal-list',
  templateUrl: './annonce-modal-list.component.html',
  styleUrls: ['./annonce-modal-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnonceModalListComponent {

  // ✅ AJOUT : nécessaire pour construire les URLs des images/documents
  // (le backend renvoie des noms de fichiers "nettoyés", pas des URLs
  // complètes — même convention que côté mobile).
  public baseUrl = environment.api;

  constructor(
    public _dialogRef: MatDialogRef<AnnonceModalListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  close() {
    this._dialogRef.close();
  }
}