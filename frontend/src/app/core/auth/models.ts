export type RoleUtilisateur = 'Collaborateur' | 'Manager' | 'Responsable RH';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
}

export interface ReponseAuth {
  accessToken: string;
  user: Utilisateur;
}

export interface InscriptionPayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface ConnexionPayload {
  email: string;
  motDePasse: string;
}
