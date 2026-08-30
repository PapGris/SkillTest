import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PasserEvaluationDto } from './dto/passer-evaluation.dto.js';

export interface DetailQuestion {
  questionId: number;
  enonce: string;
  pointsPossibles: number;
  pointsObtenus: number;
  correcte: boolean;
  reponsesChoisies: number[];
  reponsesCorrectes: number[];
}

@Injectable()
export class PassagesService {
  constructor(private readonly prisma: PrismaService) {}

  async passerEvaluation(evaluationId: number, utilisateurId: number, dto: PasserEvaluationDto) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { questions: { include: { reponses: true }, orderBy: { id: 'asc' } } },
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${evaluationId} introuvable`);
    }
    if (evaluation.questions.length === 0) {
      throw new BadRequestException("Cette evaluation n'a pas encore de questions");
    }

    const reponsesParQuestion = new Map<number, number[]>();
    for (const entree of dto.reponses) {
      const question = evaluation.questions.find((q) => q.id === entree.questionId);
      if (!question) {
        throw new BadRequestException(`La question ${entree.questionId} n'appartient pas a cette evaluation`);
      }
      const idsValides = new Set(question.reponses.map((r) => r.id));
      for (const reponseId of entree.reponseIds) {
        if (!idsValides.has(reponseId)) {
          throw new BadRequestException(`La reponse ${reponseId} n'appartient pas a la question ${entree.questionId}`);
        }
      }
      reponsesParQuestion.set(entree.questionId, entree.reponseIds);
    }

    let scoreObtenu = 0;
    let scoreMax = 0;
    const detail: DetailQuestion[] = [];
    const reponsesDonneesACreer: { questionId: number; reponseId: number }[] = [];

    for (const question of evaluation.questions) {
      scoreMax += question.points;

      const idsCorrects = question.reponses.filter((r) => r.estCorrecte).map((r) => r.id).sort((a, b) => a - b);
      const idsChoisis = (reponsesParQuestion.get(question.id) ?? []).slice().sort((a, b) => a - b);
      const estCorrecte =
        idsCorrects.length === idsChoisis.length && idsCorrects.every((id, i) => id === idsChoisis[i]);

      if (estCorrecte) {
        scoreObtenu += question.points;
      }

      detail.push({
        questionId: question.id,
        enonce: question.enonce,
        pointsPossibles: question.points,
        pointsObtenus: estCorrecte ? question.points : 0,
        correcte: estCorrecte,
        reponsesChoisies: idsChoisis,
        reponsesCorrectes: idsCorrects,
      });

      for (const reponseId of idsChoisis) {
        reponsesDonneesACreer.push({ questionId: question.id, reponseId });
      }
    }

    const passage = await this.prisma.passageEvaluation.create({
      data: {
        utilisateurId,
        evaluationId,
        scoreObtenu,
        reponsesDonnees: { create: reponsesDonneesACreer },
      },
    });

    return {
      id: passage.id,
      evaluationId: passage.evaluationId,
      datePassage: passage.datePassage,
      scoreObtenu: passage.scoreObtenu,
      scoreMax,
      detail,
    };
  }

  findMine(utilisateurId: number) {
    return this.prisma.passageEvaluation.findMany({
      where: { utilisateurId },
      include: { evaluation: { select: { id: true, titre: true, typeEvaluation: true } } },
      orderBy: { datePassage: 'desc' },
    });
  }

  async findOneMine(id: number, utilisateurId: number) {
    const passage = await this.loadPassageAvecDetail(id);
    if (passage.utilisateurId !== utilisateurId) {
      throw new ForbiddenException("Cette tentative ne t'appartient pas");
    }
    return passage;
  }

  async findAllForEvaluation(evaluationId: number) {
    const evaluation = await this.prisma.evaluation.findUnique({ where: { id: evaluationId } });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${evaluationId} introuvable`);
    }
    return this.prisma.passageEvaluation.findMany({
      where: { evaluationId },
      include: { utilisateur: { select: { id: true, nom: true, prenom: true, email: true } } },
      orderBy: { datePassage: 'desc' },
    });
  }

  private async loadPassageAvecDetail(id: number) {
    const passage = await this.prisma.passageEvaluation.findUnique({
      where: { id },
      include: {
        evaluation: { include: { questions: { include: { reponses: true }, orderBy: { id: 'asc' } } } },
        reponsesDonnees: true,
      },
    });
    if (!passage) {
      throw new NotFoundException(`Passage ${id} introuvable`);
    }

    let scoreMax = 0;
    const detail: DetailQuestion[] = [];
    for (const question of passage.evaluation.questions) {
      scoreMax += question.points;
      const idsCorrects = question.reponses.filter((r) => r.estCorrecte).map((r) => r.id).sort((a, b) => a - b);
      const idsChoisis = passage.reponsesDonnees
        .filter((rd) => rd.questionId === question.id)
        .map((rd) => rd.reponseId)
        .sort((a, b) => a - b);
      const correcte = idsCorrects.length === idsChoisis.length && idsCorrects.every((id, i) => id === idsChoisis[i]);

      detail.push({
        questionId: question.id,
        enonce: question.enonce,
        pointsPossibles: question.points,
        pointsObtenus: correcte ? question.points : 0,
        correcte,
        reponsesChoisies: idsChoisis,
        reponsesCorrectes: idsCorrects,
      });
    }

    return {
      id: passage.id,
      utilisateurId: passage.utilisateurId,
      evaluationId: passage.evaluationId,
      datePassage: passage.datePassage,
      scoreObtenu: passage.scoreObtenu,
      scoreMax,
      evaluation: { id: passage.evaluation.id, titre: passage.evaluation.titre },
      detail,
    };
  }
}
