import { Component, OnInit, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router';
// import { GenyFormValidationInterface, GENY_FORM_VALIDATION_MESSAGE, MyErrorStateMatcher } from 'app/shared/form-fonction';


import { ReservationInterface } from '../../reservation.interface';
import { ReservationService } from '../../reservation.service';

@Component({
  selector: 'app-reservation-modal-form',
  templateUrl: './reservation-modal-form.component.html',
  styleUrls: ['./reservation-modal-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ReservationModalFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReservationModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReservationInterface,
    private _reservationService: ReservationService,
    public _formBuilder: FormBuilder,
  ) { }

	public form: FormGroup;
	public inProgress: Boolean = false;
	public reservation: ReservationInterface;
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
	// 	const reservation: ReservationInterface  = this.form.value;
		
	// 	const send = (!reservation.id) ? this._reservationService.save(reservation) : this._reservationService.update(reservation);
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
