import { Component, OnInit, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router';
// import { GenyFormValidationInterface, GENY_FORM_VALIDATION_MESSAGE, MyErrorStateMatcher } from 'app/shared/form-fonction';


import { AbonnementInterface } from '../../abonnement.interface';
import { AbonnementService } from '../../abonnement.service';

@Component({
  selector: 'app-abonnement-modal-form',
  templateUrl: './abonnement-modal-form.component.html',
  styleUrls: ['./abonnement-modal-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AbonnementModalFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AbonnementModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AbonnementInterface,
    private _abonnementService: AbonnementService,
    public _formBuilder: FormBuilder,
  ) { }

	public form: FormGroup;
	public inProgress: Boolean = false;
	public abonnement: AbonnementInterface;
	// public matcher = new MyErrorStateMatcher();
	// public validationMessages:GenyFormValidationInterface[] = GENY_FORM_VALIDATION_MESSAGE;

	ngOnInit() {
		this.buildForm();
		if(this.data?.id){
			this.formPatchValue(this.data);

		}
	}

	// Construction du formulaire
	buildForm = (): void => {
		this.form = this._formBuilder.group({
			id: new FormControl(null),
			libelle : new FormControl(null),
			description : new FormControl(null),
			empty1 : new FormControl(null),
			empty2 : new FormControl(null),
			empty3 : new FormControl(null),
			empty4 : new FormControl(null),
			empty5 : new FormControl(null),
			utilisateurCreation : new FormControl(1),
			geler : new FormControl(0),
	 });
	}
	
	// Remplissage du formulaire avec les données initiales
	formPatchValue(value: any) {
		this.form.patchValue(value);
	}
	
	//Gestion des messages d'erreurs des champs du formulaire

	//   getFormMessageError(type, errors){

	// 	 return this._appService.getFormMessageError(type, errors);
	//  }


	// Soumission du formulaire
	// save(): void {
	// 	this.inProgress = true;
	// 	const abonnement: AbonnementInterface  = this.form.value;
		
	// 	const send = (!abonnement.id) ? this._abonnementService.save(abonnement) : this._abonnementService.update(abonnement);
	// 	send.subscribe(result => {
	// 		this.inProgress = false;
	// 		if (result) {
	// 			//Action ouvrir
	// 			this.dialogRef.close(result);
				
	// 		} else {
	// 			//Action fermer
	// 		}
	// 	});
	// }

 
 compareFn(c1: any, c2:any): boolean {     
  return c1 && c2 ? c1.id === c2.id : c1 === c2; 
 }
 
 close() {
    this.dialogRef.close(); 
 }

//  la fonction pour le popop

} 
