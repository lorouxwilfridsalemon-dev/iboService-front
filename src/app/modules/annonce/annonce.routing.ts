import { Route } from '@angular/router';
import { AnnonceListComponent } from './list/annonce-list.component';
import { AnnonceModalFormComponent } from './modal/form/annonce-modal-form.component';

export const annonceRoutes: Route[] = [
  // ✅ Liste des annonces (route par défaut)
  {
    path: '',
    component: AnnonceListComponent,
  },

  // ✅ NOUVELLE ROUTE : Publier une annonce
  // ⚠️ DOIT être AVANT 'modifier/:id' pour éviter les conflits
  {
    path: 'ajouter',
    component: AnnonceModalFormComponent,
  },

  // ✅ Modifier une annonce existante
  {
    path: 'modifier/:id',
    component: AnnonceModalFormComponent,
  },
]; 