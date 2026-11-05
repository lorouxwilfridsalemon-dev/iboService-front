import { Component, OnInit, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
 
import { Router, ActivatedRoute } from '@angular/router';

import { AnnonceInterface } from '../annonce.interface';
import { AnnonceService } from '../annonce.service';

@Component({
  selector: 'app-annonce-form',
  templateUrl: './annonce-form.component.html',
  styleUrls: ['./annonce-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AnnonceFormComponent implements OnInit {

  constructor(
    private _annonceService: AnnonceService,
    private _router: Router,
	private _route: ActivatedRoute,
    public _formBuilder: FormBuilder,
  ) { }

	public form: FormGroup;
	public inProgress: Boolean = false;
	public annonce: AnnonceInterface;

	ngOnInit() {
		this.buildForm();
		this._route.paramMap.subscribe(params => { 
          const id = params.get('id');
          if(id){
            this.getAnnonce(id);
          }
        });
	}
	
	getAnnonce = (id) => {
      this.inProgress = true; // Démarre le loader
      this._annonceService.findOne({ id }).subscribe(result => {
          this.inProgress = false; // stop le loader
          this.annonce = result;
		  if(result?.id){
			this.formPatchValue(result);
		  }
      });
	}

	// Construction du formulaire
	buildForm = (): void => {
		this.form = this._formBuilder.group({
			id: new FormControl(null),
			raisonSocial : new FormControl(null, Validators.compose([Validators.required])),
			nom : new FormControl(null, Validators.compose([Validators.required])),
			prenoms : new FormControl(null, Validators.compose([Validators.required])),
			dateNaissance : new FormControl(null, Validators.compose([Validators.required])),
			numeroPiece : new FormControl(null),
			email : new FormControl(null),
			contact : new FormControl(null, Validators.compose([Validators.required])),
			contactSecond : new FormControl(null),
			adresseGeographique : new FormControl(null, Validators.compose([Validators.required])),
			empty1 : new FormControl(null),
			empty2 : new FormControl(null),
			empty3 : new FormControl(null),
			empty4 : new FormControl(null),
			empty5 : new FormControl(null),
			geler : new FormControl(0, Validators.compose([Validators.required])),
			utilisateurCreation : new FormControl(1, Validators.compose([Validators.required])),
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
	save(): void {
		this.inProgress = true;
		const annonce: AnnonceInterface  = this.form.value;
		
		const send = (!annonce) ? this._annonceService.save(annonce) : this._annonceService.update(annonce);
		send.subscribe(result => {
			this.inProgress = false;
			if (result) {
				this.afficherListeAnnonce();
				//Action ouvrir
				
			} else {
				//Action fermer
			}
		});
	}

 afficherListeAnnonce(): void{
    this._router.navigate([`/m/annonce/list`]);
 }
 
 compareFn(c1: any, c2:any): boolean {     
  return c1 && c2 ? c1.id === c2.id : c1 === c2; 
 }

}
