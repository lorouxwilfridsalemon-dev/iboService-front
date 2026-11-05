import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CaracteristiquesService } from '../caracteristiques.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-caracteristiques-form',
  templateUrl: './caracteristiques-form.component.html',
  styleUrls: ['./caracteristiques-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaracteristiquesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CaracteristiquesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _caracteristiquesService: CaracteristiquesService,
    public _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
  ) { }

  public form: FormGroup;
  public inProgress: boolean = false;

  ngOnInit() {
    this.buildForm();
    if (this.data?.id) {
      this.formPatchValue(this.data);
    }
  }

  // ✅ Construction du formulaire avec validations
  buildForm = (): void => {
    this.form = this._formBuilder.group({
      id: new FormControl(null),
      // ✅ CORRIGÉ : 'nom' au lieu de 'libelle'
      nom: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),
      // ✅ AJOUT : description
      description: new FormControl(null, Validators.maxLength(100)),
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
    const caracteristiquesForm: any = this.form.value;

    // ✅ CORRIGÉ : utilise la méthode appropriée avec ID dans l'URL
    const send = (!caracteristiquesForm.id)
      ? this._caracteristiquesService.save(caracteristiquesForm)
      : this._caracteristiquesService.update(caracteristiquesForm);

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

  close() {
    this.dialogRef.close();
  }
} 