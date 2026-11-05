// import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { fuseAnimations } from '@fuse/animations';
// import { FuseAlertType } from '@fuse/components/alert';
// import { AuthService } from 'app/core/auth/auth.service';

// @Component({
//     selector     : 'auth-sign-in',
//     templateUrl  : './sign-in.component.html',
//     encapsulation: ViewEncapsulation.None,
//     animations   : fuseAnimations
// })
// export class AuthSignInComponent implements OnInit
// {
//     @ViewChild('signInNgForm') signInNgForm: NgForm;

//     alert: { type: FuseAlertType; message: string } = {
//         type   : 'success',
//         message: ''
//     };
//     signInForm: FormGroup;
//     showAlert: boolean = false;

//     /**
//      * Constructor
//      */
//     constructor(
//         private _activatedRoute: ActivatedRoute,
//         private _authService: AuthService,
//         private _formBuilder: FormBuilder,
//         private _router: Router
//     )
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Lifecycle hooks
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * On init
//      */
//     ngOnInit(): void
//     {
//         // Create the form
//         this.signInForm = this._formBuilder.group({
//             email     : ['hughes.brian@company.com', [Validators.required, Validators.email]],
//             password  : ['admin', Validators.required],
//             rememberMe: ['']
//         });
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Sign in
//      */
//     signIn(): void
//     {
//         // Return if the form is invalid
//         if ( this.signInForm.invalid )
//         {
//             return;
//         }

//         // Disable the form
//         this.signInForm.disable();

//         // Hide the alert
//         this.showAlert = false;

//         // Sign in
//         this._authService.signIn(this.signInForm.value)
//             .subscribe(
//                 () => {

//                     // Set the redirect url.
//                     // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
//                     // to the correct page after a successful sign in. This way, that url can be set via
//                     // routing file and we don't have to touch here.
//                     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

//                     // Navigate to the redirect url
//                     this._router.navigateByUrl(redirectURL);

//                 },
//                 (response) => {

//                     // Re-enable the form
//                     this.signInForm.enable();

//                     // Reset the form
//                     this.signInNgForm.resetForm();

//                     // Set the alert
//                     this.alert = {
//                         type   : 'error',
//                         message: 'Wrong email or password'
//                     };

//                     // Show the alert
//                     this.showAlert = true;
//                 }
//             );
//     }
// }


import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
    }

    ngOnInit(): void
    {
        // ✅ CORRIGÉ : 'contact' (téléphone) au lieu de 'email' — c'est ce
        // que le backend attend pour se connecter. Valeurs de démo
        // ('hughes.brian@company.com', 'admin') retirées.
        this.signInForm = this._formBuilder.group({
            contact   : [null, [Validators.required]],
            password  : [null, Validators.required],
            rememberMe: ['']
        });
    }

    signIn(): void
    {
        if ( this.signInForm.invalid )
        {
            return;
        }

        this.signInForm.disable();
        this.showAlert = false;

        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    this._router.navigateByUrl(redirectURL);
                },
                (error) => {
                    this.signInForm.enable();
                    this.signInNgForm.resetForm();

                    // ✅ CORRIGÉ : affiche le vrai message renvoyé par le
                    // backend ('login ou mot de passe incorrect', 'Ce
                    // compte a été suspendu'...) au lieu d'un message figé.
                    this.alert = {
                        type   : 'error',
                        message: error?.message || 'Téléphone ou mot de passe incorrect'
                    };

                    this.showAlert = true;
                }
            );
    }
}