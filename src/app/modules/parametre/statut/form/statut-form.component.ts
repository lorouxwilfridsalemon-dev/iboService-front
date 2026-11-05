import { Component, OnInit, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router';
import { StatutService } from '../statut.service';
// import { StatutService } from '../nature-projet.service';
// import { StatutFormService } from '../../statutForm.service';

@Component({
  selector: 'app-type-projet-form',
  templateUrl: './statut-form.component.html',
  styleUrls: ['./statut-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StatutFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StatutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _statutService: StatutService,
    public _formBuilder: FormBuilder,
  ) { }

	public form: FormGroup;
	public inProgress: Boolean = false;
	public statutForm: any;

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
			dateCreation : new FormControl(new Date()),
			geler : new FormControl(0, Validators.compose([Validators.required])),
			utilisateurCreation : new FormControl(1, Validators.compose([Validators.required])),
	 });
	}
	
	
	// Remplissage du formulaire avec les données initiales
	formPatchValue(value: any) {
		this.form.patchValue(value);
	}
	
	


	// Soumission du formulaire
	save(): void {
		this.inProgress = true;
		
		const statut: any  = this.form.value;
		console.log('statut', statut);

		
		const send = (!statut.id) ? this._statutService.save(statut) : this._statutService.update(statut);
		send.subscribe(result => {
			
			this.inProgress = false;
			if (result) {
				//Action ouvrir
				this.dialogRef.close(result);
				
			} else {
				//Action fermer
			}
		});

		
	}

	


	// save(): void {
	// 	this.inProgress = true;
	// 	const statutForm: any  = this.form.value;
		
	// 	const send = (!statutForm.id) ? this._statutService.save(statutForm) : this._statutService.update(statutForm);
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
