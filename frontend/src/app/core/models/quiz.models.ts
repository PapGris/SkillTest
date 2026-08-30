export interface Competence {
  id: number;
  nomCompetence: string;
  description: string | null;
}

export interface MaCompetence {
  utilisateurId: number;
  competenceId: number;
  niveauEstime: number;
  competence: Competence;
}

export interface EvaluationListItem {
  id: number;
  titre: string;
  typeEvaluation: string;
  parcoursId: number;
  parcours: { id: number; titre: string };
  _count: { questions: number };
}

export interface ReponseOption {
  id: number;
  texteReponse: string;
  questionId: number;
  /** Present uniquement quand l'appelant est Manager/Responsable RH (jamais pour un Collaborateur) */
  estCorrecte?: boolean;
}

export interface QuestionDetail {
  id: number;
  enonce: string;
  points: number;
  evaluationId: number;
  competenceId: number | null;
  reponses: ReponseOption[];
}

export interface EvaluationDetail {
  id: number;
  titre: string;
  typeEvaluation: string;
  parcoursId: number;
  questions: QuestionDetail[];
}

export interface ReponseCorrection {
  id: number;
  texte: string;
}

export interface DetailQuestionCorrection {
  questionId: number;
  enonce: string;
  pointsPossibles: number;
  pointsObtenus: number;
  correcte: boolean;
  reponsesChoisies: ReponseCorrection[];
  reponsesCorrectes: ReponseCorrection[];
}

export interface ResultatPassage {
  id: number;
  evaluationId: number;
  datePassage: string;
  scoreObtenu: number;
  scoreMax: number;
  detail: DetailQuestionCorrection[];
}

export interface PassageListItem {
  id: number;
  scoreObtenu: number;
  datePassage: string;
  utilisateurId: number;
  evaluationId: number;
  evaluation: { id: number; titre: string; typeEvaluation: string };
}

export interface PassageDetail extends ResultatPassage {
  utilisateurId: number;
  evaluation: { id: number; titre: string };
}

export interface ReponseSoumise {
  questionId: number;
  reponseIds: number[];
}
