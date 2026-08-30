export interface ParcoursListItem {
  id: number;
  titre: string;
  description: string | null;
  createurId: number;
  createur: { id: number; nom: string; prenom: string };
  _count: { evaluations: number };
}

export interface CreerParcoursPayload {
  titre: string;
  description?: string;
}

export interface CreerEvaluationPayload {
  parcoursId: number;
  titre: string;
  typeEvaluation: string;
}

export interface CreerReponsePayload {
  texteReponse: string;
  estCorrecte: boolean;
}

export interface CreerQuestionPayload {
  enonce: string;
  points: number;
  competenceId?: number;
  reponses: CreerReponsePayload[];
}

export interface PassageRapport {
  id: number;
  scoreObtenu: number;
  datePassage: string;
  utilisateurId: number;
  evaluationId: number;
  utilisateur: { id: number; nom: string; prenom: string; email: string };
}

export interface UtilisateurListItem {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  createdAt: string;
  role: { nomRole: string };
}
