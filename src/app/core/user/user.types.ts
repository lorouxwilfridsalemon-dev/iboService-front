// export interface User
// {
//     id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//     status?: string;
// } 

// ✅ RECONSTRUIT — l'ancienne interface (name, email, avatar, status)
// correspondait au mock de démo Fuse, pas à la vraie forme renvoyée par
// le backend (POST /auth/login, GET /auth/user).

export interface ProfilUtilisateur {
  id: number;
  libelle: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  pseudo?: string;
  email: string;
  contact?: string;
  description?: string;
  language?: string;
  devise?: string;
  photo?: string;
  geler?: number;
  dateCreation?: string;
  profil?: ProfilUtilisateur;
}