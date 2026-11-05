// modal/form/utilisateur-modal-form.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService } from '../../utilisateur.service';

@Component({
  selector: 'app-utilisateur-modal-form',
  templateUrl: './utilisateur-modal-form.component.html',
  styleUrls: ['./utilisateur-modal-form.component.scss']
})
export class UtilisateurModalFormComponent implements OnInit {
  form: FormGroup;
  inProgress = false;

  constructor(
    public dialogRef: MatDialogRef<UtilisateurModalFormComponent>,
    private _formBuilder: FormBuilder,
    private _utilisateurService: UtilisateurService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [''],
      description: ['']
    });

    if (this.data?.utilisateur) {
      this.form.patchValue(this.data.utilisateur);
    }
  }

  save(): void {
    if (this.form.invalid) return;
    
    this.inProgress = true;
    // Logique de sauvegarde
    this.dialogRef.close(this.form.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}